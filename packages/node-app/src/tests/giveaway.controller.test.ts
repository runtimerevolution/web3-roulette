import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { Giveaway } from '../models/giveaway.model';
import { giveawaysContract } from '../contracts';

const createGiveawayMock = jest.fn().mockReturnValue({
  send: () => ({}),
});

giveawaysContract.methods.createGiveaway = createGiveawayMock;

beforeEach(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
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
      new Giveaway({
        title: 'Giveaway 1',
        description: 'Description for giveaway 1',
        startTime: Date.now(),
        endTime: Date.now() + 60,
        numberOfWinners: 1
      }),
      new Giveaway({
        title: 'Giveaway 2',
        description: 'Description for giveaway 2',
        startTime: Date.now(),
        endTime: Date.now() + 120,
        numberOfWinners: 1
      }),
    ];
    await Promise.all(giveaways.map((giveaway) => giveaway.save()));

    const response = await request(app).get('/giveaways');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Giveaway 1' }),
        expect.objectContaining({ title: 'Giveaway 2' }),
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
    const giveaway = new Giveaway({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: Date.now(),
      endTime: Date.now() + 60,
      numberOfWinners: 1
    });
    await giveaway.save();

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
      startTime: Date.now(),
      endTime: Date.now() + 86400000,
      numberOfWinners: 1,
      requirements: []
    };

    const response = await request(app)
      .post('/giveaways')
      .send(newGiveaway)
      .expect(200);

    expect(response.body.title).toEqual(newGiveaway.title);
    expect(response.body.description).toEqual(newGiveaway.description);
    expect(new Date(response.body.startTime).getTime()).toEqual(newGiveaway.startTime);
    expect(new Date(response.body.endTime).getTime()).toEqual(newGiveaway.endTime);
    expect(response.body.numberOfWinners).toEqual(newGiveaway.numberOfWinners);
    expect(response.body.requirements).toEqual(newGiveaway.requirements);

    const localGiveaway = await Giveaway.findById(response.body._id);
    expect(localGiveaway.title).toEqual(newGiveaway.title);
    expect(localGiveaway.description).toEqual(newGiveaway.description);
    expect(localGiveaway.startTime.getTime()).toEqual(newGiveaway.startTime);
    expect(localGiveaway.endTime.getTime()).toEqual(newGiveaway.endTime);
    expect(localGiveaway.numberOfWinners).toEqual(newGiveaway.numberOfWinners);
    expect(localGiveaway.requirements).toEqual(newGiveaway.requirements);

    expect(giveawaysContract.methods.createGiveaway)
      .toHaveBeenCalledWith(response.body._id, newGiveaway.startTime, newGiveaway.endTime, newGiveaway.numberOfWinners);
  })
});
