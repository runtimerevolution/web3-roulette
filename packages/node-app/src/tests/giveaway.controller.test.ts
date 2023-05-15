import request from 'supertest';
import mongoose from 'mongoose';
import fs from 'fs';
import { app } from '../app';
import { Giveaway } from '../models/giveaway.model';
import { giveawaysContract } from '../contracts';
import { objectIdToBytes24 } from '../utils/web3.util';

const createGiveawayMock = jest.fn().mockReturnValue({ send: () => ({}) });
const addParticipantMock = jest.fn().mockReturnValue({ send: () => ({}) });
const generateWinnersMock = jest.fn().mockReturnValue({ send: () => ({}) });
const getWinnersMock = jest.fn().mockReturnValue({ call: () => ['WINNER_ADDRESS'] });

giveawaysContract.methods.createGiveaway = createGiveawayMock;
giveawaysContract.methods.addParticipant = addParticipantMock;
giveawaysContract.methods.generateWinners = generateWinnersMock;
giveawaysContract.methods.getWinners = getWinnersMock;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Giveaway.deleteMany({});
});

describe('GET /', () => {
  it('should return a message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ alive: 'True' });
  });
});

describe('GET /giveaways', () => {
  it('should return an empty array if no giveaways exist', async () => {
    const response = await request(app).get('/giveaways');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return a list of giveaways if they exist', async () => {
    const giveaways = [
      await Giveaway.create({
        title: 'Giveaway 1',
        description: 'Description for giveaway 1',
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        numberOfWinners: 1,
        prize: 'Test prize',
        image: 'test-image-base64'
      }),
      await Giveaway.create({
        title: 'Giveaway 2',
        description: 'Description for giveaway 2',
        startTime: Date.now() + 60,
        endTime: Date.now() + 120,
        numberOfWinners: 1,
        prize: 'Test prize',
        image: 'test-image-base64'
      }),
    ];

    const response = await request(app).get('/giveaways');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: giveaways[0].title }),
        expect.objectContaining({ title: giveaways[1].title }),
      ]),
    );
  });
});

describe('GET /giveaways/:id', () => {
  it('should return error when the id does not exist', async () => {
    const response = await request(app).get('/giveaways/invalid-id');    
    expect(response.status).toBe(500);
  });

  it('should return a giveaway if it exists', async () => {
    const giveaway = await Giveaway.create({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: Date.now() + 60,
      endTime: Date.now() + 120,
      numberOfWinners: 1,
      prize: 'Test prize',
      image: 'test-image-base64'
    });

    const response = await request(app).get(`/giveaways/${giveaway._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Giveaway');
    expect(response.body.description).toBe('Description for giveaway');
    expect(new Date(response.body.startTime)).toEqual(giveaway.startTime);
    expect(new Date(response.body.endTime)).toEqual(giveaway.endTime);
    expect(response.body.numberOfWinners).toEqual(1);
  });
});

describe('POST /giveaways', () => {
  it('should create a new giveaway and return it in the response', async () => {
    const newGiveaway = {
      title: 'Test Giveaway',
      description: 'This is a test giveaway',
      startTime: Date.now() + 60,
      endTime: Date.now() + 120,
      numberOfWinners: 1,
      prize: 'Test prize'
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
      .attach('image', fs.readFileSync(`${__dirname}/test-image.png`), 'tests/test-image.png')
      .expect(201);

    expect(response.body.title).toEqual(newGiveaway.title);
    expect(response.body.description).toEqual(newGiveaway.description);
    expect(new Date(response.body.startTime).getTime()).toEqual(newGiveaway.startTime);
    expect(new Date(response.body.endTime).getTime()).toEqual(newGiveaway.endTime);
    expect(response.body.numberOfWinners).toEqual(newGiveaway.numberOfWinners);

    const localGiveaway = await Giveaway.findById(response.body._id);
    expect(localGiveaway.title).toEqual(newGiveaway.title);
    expect(localGiveaway.description).toEqual(newGiveaway.description);
    expect(localGiveaway.startTime.getTime()).toEqual(newGiveaway.startTime);
    expect(localGiveaway.endTime.getTime()).toEqual(newGiveaway.endTime);
    expect(localGiveaway.numberOfWinners).toEqual(newGiveaway.numberOfWinners);

    expect(giveawaysContract.methods.createGiveaway)
      .toHaveBeenCalledWith(
        objectIdToBytes24(response.body._id),
        newGiveaway.startTime,
        newGiveaway.endTime,
        newGiveaway.numberOfWinners);
    })
});

describe('PUT /giveaways/:id', () => {
  it('should return error when the id does not exist', async () => {
    const response = await request(app).put('/giveaways/invalid-id');    
    expect(response.status).toBe(500);
  });

  it('should update a giveaway if it exists', async () => {
    const giveaway = await Giveaway.create({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: Date.now() + 60,
      endTime: Date.now() + 120,
      numberOfWinners: 1,
      prize: 'Test prize',
      image: 'test-image-base64'
    });
    const updatedGiveaway = {
      title: 'Updated Giveaway',
      description: 'Description for giveaway',
      numberOfWinners: 2,
      prize: 'Test prize 2',
      image: 'test-image-base64-2'
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
  });
});

describe('POST /giveaways/:id/participants', () => {
  it('should add a new participant', async () => {
    const giveaway = await Giveaway.create({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: Date.now() + 60,
      endTime: Date.now() + 120,
      numberOfWinners: 1,
      prize: 'Test prize',
      image: 'test-image-base64'
    });
    const body = { participant: 'participant@example.com' };

    const response = await request(app)
      .post(`/giveaways/${giveaway._id}/participants`)
      .send(body)
      .expect(200);
        
    expect(response.body.participants.length).toEqual(1);
    expect(response.body.participants[0]).toEqual('PARTICIPANT_ADDRESS');

    expect(giveawaysContract.methods.addParticipant)
      .toHaveBeenCalledWith(
        objectIdToBytes24(giveaway._id),
        'PARTICIPANT_ADDRESS');
  })
})

describe('GET /giveaways/:id/generate-winners', () => {
  it('should generate and return winners', async () => {
    const giveaway = await Giveaway.create({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: Date.now() + 60,
      endTime: Date.now() + 120,
      numberOfWinners: 1,
      prize: 'Test prize',
      image: 'test-image-base64'
    });

    await new Promise((r) => setTimeout(r, 200));  

    const response = await request(app)
      .get(`/giveaways/${giveaway._id}/generate-winners`)
      .expect(200);
        
    expect(response.body.winners.length).toEqual(1);
    expect(response.body.winners[0]).toEqual('WINNER_ADDRESS');
    
    expect(giveawaysContract.methods.generateWinners)
      .toHaveBeenCalledWith(objectIdToBytes24(giveaway._id));
    
    expect(giveawaysContract.methods.getWinners)
      .toHaveBeenCalledWith(objectIdToBytes24(giveaway._id));
  })
})
