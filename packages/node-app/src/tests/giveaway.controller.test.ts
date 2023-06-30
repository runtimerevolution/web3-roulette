import fs from 'fs';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';
import { giveawaysContract } from '../contracts';
import {
  Giveaway,
  ParticipantState,
} from '../models/giveaway.model';
import { User } from '../models/user.model';
import { isoStringToSecondsTimestamp } from '../utils/date.utils';
import {
  encrypt,
  objectIdToBytes24,
} from '../utils/web3.utils';
import {
  adminAuthenticated,
  authenticated,
  notAuthenticated,
  wait,
} from './__utils__/helper.utils';

jest.mock('../middlewares/auth.middleware');

const createGiveawayMock = jest.fn().mockReturnValue({ send: () => ({}) });
const addParticipantMock = jest.fn().mockReturnValue({ send: () => ({}) });
const generateWinnersMock = jest.fn().mockReturnValue({ send: () => ({}) });

const getWinnersMock = jest
  .fn()
  .mockReturnValue({ call: () => ['WINNER_ADDRESS'] });

giveawaysContract.methods.createGiveaway = createGiveawayMock;
giveawaysContract.methods.addParticipant = addParticipantMock;
giveawaysContract.methods.generateWinners = generateWinnersMock;
giveawaysContract.methods.getWinners = getWinnersMock;

jest.mock('../utils/web3.utils', () => ({
  __esModule: true,
  decrypt: () => 'DECRYPTED_DATA',
  encrypt: () => 'ENCRYPTED_DATA',
  objectIdToBytes24: () => 'BYTES24',
}));

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Giveaway.deleteMany({});
  await User.deleteMany({});
  jest.clearAllMocks();
});

describe('GET /', () => {
  it('should return a message while authenticated', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ alive: 'True' });
  });
});

describe('GET /giveaways', () => {
  it(
    'should return an empty array if no giveaways exist while authenticated',
    authenticated(async () => {
      const response = await request(app).get('/giveaways');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    })
  );

  it(
    'should return a list of giveaways if they exist while authenticated',
    authenticated(async () => {
      const giveaways = [
        await Giveaway.create({
          title: 'Giveaway 1',
          description: 'Description for giveaway 1',
          startTime: Date.now() + 60,
          endTime: Date.now() + 120,
          numberOfWinners: 1,
          prize: 'Test prize',
          image: 'test-image-base64',
        }),
        await Giveaway.create({
          title: 'Giveaway 2',
          description: 'Description for giveaway 2',
          startTime: Date.now() + 60,
          endTime: Date.now() + 120,
          numberOfWinners: 1,
          prize: 'Test prize',
          image: 'test-image-base64',
        }),
      ];

      const response = await request(app).get('/giveaways');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: giveaways[0].title }),
          expect.objectContaining({ title: giveaways[1].title }),
        ])
      );
    })
  );
});

describe('GET /giveaways/:id', () => {
  it(
    'should return error when the id does not exist while authenticated',
    authenticated(async () => {
      const response = await request(app).get('/giveaways/invalid-id');
      expect(response.status).toBe(500);
    })
  );

  it(
    'should return a giveaway if it exists while authenticated',
    authenticated(async () => {
      const giveaway = await Giveaway.create({
        title: 'Giveaway',
        description: 'Description for giveaway',
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        numberOfWinners: 1,
        prize: 'Test prize',
        image: 'test-image-base64',
      });

      const response = await request(app).get(`/giveaways/${giveaway._id}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Giveaway');
      expect(response.body.description).toBe('Description for giveaway');
      expect(new Date(response.body.startTime)).toEqual(giveaway.startTime);
      expect(new Date(response.body.endTime)).toEqual(giveaway.endTime);
      expect(response.body.numberOfWinners).toEqual(1);
    })
  );
});

describe('POST /giveaways', () => {
  const giveawayData = {
    title: 'Test Giveaway',
    description: 'This is a test giveaway',
    numberOfWinners: 1,
    prize: 'Test prize',
    image: 'test-image',
  };

  it(
    'should create a new giveaway and return it in the response while admin authenticated',
    adminAuthenticated(async () => {
      const newGiveaway = {
        ...giveawayData,
        startTime: new Date(Date.now() + 60).toISOString(),
        endTime: new Date(Date.now() + 120).toISOString(),
      };

      const response = await request(app)
        .post('/giveaways')
        .set('content-type', 'multipart/form-data')
        .field('title', newGiveaway.title)
        .field('description', newGiveaway.description)
        .field('startTime', newGiveaway.startTime)
        .field('endTime', newGiveaway.endTime)
        .field('numberOfWinners', newGiveaway.numberOfWinners)
        .field('prize', newGiveaway.prize)
        .attach(
          'image',
          fs.readFileSync(`${__dirname}/test-image.png`),
          'tests/test-image.png'
        )
        .expect(201);

      expect(response.body.title).toEqual(newGiveaway.title);
      expect(response.body.description).toEqual(newGiveaway.description);
      expect(response.body.startTime).toEqual(newGiveaway.startTime);
      expect(response.body.endTime).toEqual(newGiveaway.endTime);
      expect(response.body.numberOfWinners).toEqual(
        newGiveaway.numberOfWinners
      );

      const localGiveaway = await Giveaway.findById(response.body._id);
      expect(localGiveaway.title).toEqual(newGiveaway.title);
      expect(localGiveaway.description).toEqual(newGiveaway.description);
      expect(localGiveaway.startTime).toEqual(new Date(newGiveaway.startTime));
      expect(localGiveaway.endTime).toEqual(new Date(newGiveaway.endTime));
      expect(localGiveaway.numberOfWinners).toEqual(
        newGiveaway.numberOfWinners
      );

      expect(giveawaysContract.methods.createGiveaway).toHaveBeenCalledWith(
        objectIdToBytes24(response.body._id),
        isoStringToSecondsTimestamp(newGiveaway.startTime),
        isoStringToSecondsTimestamp(newGiveaway.endTime),
        newGiveaway.numberOfWinners
      );
    })
  );

  it(
    'should not create new giveaway if user is not admin',
    authenticated(async () => {
      await request(app)
        .post('/giveaways')
        .set('content-type', 'multipart/form-data')
        .field('title', giveawayData.title)
        .field('description', giveawayData.description)
        .field('startTime', new Date(Date.now() + 1000).toISOString())
        .field('endTime', new Date(Date.now() + 1500).toISOString())
        .field('numberOfWinners', giveawayData.numberOfWinners)
        .field('prize', giveawayData.prize)
        .attach(
          'image',
          fs.readFileSync(`${__dirname}/test-image.png`),
          'tests/test-image.png'
        )
        .expect(401);

      const giveaway = await Giveaway.findOne({ title: giveawayData.title });
      expect(giveaway).toBeNull();
      expect(giveawaysContract.methods.createGiveaway).not.toHaveBeenCalled();
    })
  );
});

describe('PUT /giveaways/:id', () => {
  it(
    'should return error when the id does not exist while admin authenticated',
    adminAuthenticated(async () => {
      const response = await request(app).put('/giveaways/invalid-id');
      expect(response.status).toBe(500);
    })
  );

  it(
    'should update a giveaway if it exists while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        title: 'Giveaway',
        description: 'Description for giveaway',
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        numberOfWinners: 1,
        prize: 'Test prize',
        image: 'test-image-base64',
      });
      const updatedGiveaway = {
        title: 'Updated Giveaway',
        description: 'Description for giveaway',
        numberOfWinners: 2,
        prize: 'Test prize 2',
        image: 'test-image-base64-2',
      };

      const response = await request(app)
        .put(`/giveaways/${giveaway._id}`)
        .send(updatedGiveaway)
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedGiveaway.title);
      expect(response.body.description).toBe(updatedGiveaway.description);
      expect(response.body.numberOfWinners).toEqual(1);
      expect(response.body.prize).toBe(updatedGiveaway.prize);
    })
  );
});

describe('POST /giveaways/:id/participants', () => {
  const giveawayData = {
    title: 'Test Giveaway',
    description: 'This is a test giveaway',
    numberOfWinners: 1,
    prize: 'Test prize',
    image: 'test-image',
  };

  it(
    'should add a new participant while authenticated',
    authenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
      });

      const body = { id: 'example@domain.com', name: 'participant' };

      const response = await request(app)
        .put(`/giveaways/${giveaway._id}/participants`)
        .send(body)
        .expect(200);

      expect(response.body.message).toEqual('Participant added successfully');
      expect(giveawaysContract.methods.addParticipant).toHaveBeenCalled();
    })
  );

  it(
    'should not add new participant while not authenticated',
    notAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        image: 'test-image',
      });

      const payload = { id: 'participant@example.com', name: 'participant' };

      await request(app)
        .put(`/giveaways/${giveaway._id}/participants`)
        .send(payload)
        .expect(401);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(updatedGiveaway.participants.length).toEqual(0);
      expect(giveawaysContract.methods.addParticipant).not.toHaveBeenCalled();
    })
  );
});

describe('GET /giveaways/:id/generate-winners', () => {
  it(
    'should generate and return winners while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        title: 'Giveaway',
        description: 'Description for giveaway',
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        numberOfWinners: 1,
        prize: 'Test prize',
        image: 'test-image-base64',
      });

      await wait(200);

      const response = await request(app)
        .get(`/giveaways/${giveaway._id}/generate-winners`)
        .expect(200);

      expect(response.body.length).toEqual(1);
      expect(response.body[0].id).toEqual('DECRYPTED_DATA');

      expect(giveawaysContract.methods.generateWinners).toHaveBeenCalledWith(
        objectIdToBytes24(giveaway._id)
      );

      expect(giveawaysContract.methods.getWinners).toHaveBeenCalledWith(
        objectIdToBytes24(giveaway._id)
      );
    })
  );
});

describe('PUT giveaways/:id/participants/:participantId', () => {
  const participant = {
    id: 'user',
    name: 'user name',
    state: ParticipantState.PENDING,
  };

  const giveawayData = {
    title: 'Giveaway',
    description: 'Description for giveaway',
    numberOfWinners: 1,
    prize: 'Test prize',
    image: 'test-image-base64',
    participants: [participant],
  };

  it(
    'should fail if invalid participant while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { state: ParticipantState.CONFIRMED };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/invalid`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(404);
      expect(res.body.error).toEqual('Participant not found');
      expect(updatedGiveaway.participants[0].state).toEqual(
        ParticipantState.PENDING
      );
      expect(giveawaysContract.methods.addParticipant).not.toHaveBeenCalled();
    })
  );

  it(
    'should fail if invalid state while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { state: 'invalid' };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/${participant.id}`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(400);
      expect(updatedGiveaway.participants[0].state).toEqual(
        ParticipantState.PENDING
      );
      expect(giveawaysContract.methods.addParticipant).not.toHaveBeenCalled();
    })
  );

  it(
    'should update participant state while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { state: ParticipantState.CONFIRMED };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/${participant.id}`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(200);
      expect(updatedGiveaway.participants[0].state).toEqual(
        ParticipantState.CONFIRMED
      );
      expect(giveawaysContract.methods.addParticipant).toHaveBeenCalledWith(
        objectIdToBytes24(giveaway._id),
        encrypt(participant.id)
      );
    })
  );

  it(
    'should not add to contract if rejected while admin authenticated',
    adminAuthenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { state: ParticipantState.REJECTED };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/${participant.id}`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(200);
      expect(updatedGiveaway.participants[0].state).toEqual(
        ParticipantState.REJECTED
      );
      expect(giveawaysContract.methods.addParticipant).not.toHaveBeenCalled();
    })
  );

  it(
    'should not update state if user is not admin',
    authenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { state: ParticipantState.REJECTED };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/${participant.id}`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(401);
      expect(updatedGiveaway.participants[0].state).toEqual(
        ParticipantState.PENDING
      );
    })
  );

  it(
    'should not update other user notified flag',
    authenticated(async () => {
      const giveaway = await Giveaway.create({
        ...giveawayData,
        startTime: Date.now() + 60,
        endTime: Date.now() + 10000,
      });
      await wait(200);

      const body = { notified: true };
      const res = await request(app)
        .put(`/giveaways/${giveaway._id}/participants/${participant.id}`)
        .send(body);

      const updatedGiveaway = await Giveaway.findById(giveaway._id);
      expect(res.status).toEqual(401);
      expect(updatedGiveaway.participants[0].notified).toEqual(false);
    })
  );
});
