import fs from 'fs';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';
import { giveawaysContract } from '../contracts';
import { Giveaway } from '../models/giveaway.model';
import { Location } from '../models/location.model';
import { Unit, User, UserRole } from '../models/user.model';
import { getUserInfo } from '../utils/auth.util';

const userInfo = {
  email: 'example@domain.com',
  name: 'name',
  picture: 'picture',
  unit: Unit.NODE,
};

giveawaysContract.methods.createGiveaway = jest
  .fn()
  .mockReturnValue({ send: () => ({}) });

giveawaysContract.methods.addParticipant = jest
  .fn()
  .mockReturnValue({ send: () => ({}) });

jest.mock('../utils/auth.util.ts', () => ({
  getUserInfo: jest.fn(),
}));

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Location.deleteMany({});
  await Giveaway.deleteMany({});
  jest.clearAllMocks();
});

describe('POST /login', () => {
  it('login new user', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };

    (getUserInfo as jest.Mock).mockReturnValueOnce(userInfo);
    const res = await request(app).post('/login').send(payload).expect(201);

    const user = await User.findOne({ email: userInfo.email });
    expect(res.body.token).toBeDefined();
    expect(user.name).toEqual(userInfo.name);
    expect(user.picture).toEqual(userInfo.picture);
    expect(user.unit).toEqual(userInfo.unit);
    expect(user.role).toEqual(UserRole.USER);
  });

  it('login with empty tokens', async () => {
    const payload = {};

    await request(app).post('/login').send(payload).expect(400);

    const user = await User.findOne({ email: userInfo.email });
    expect(user).toBeNull();
  });

  it('login undefined user info', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };

    (getUserInfo as jest.Mock).mockReturnValueOnce(undefined);
    await request(app).post('/login').send(payload).expect(400);

    const user = await User.findOne({ email: userInfo.email });
    expect(user).toBeNull();
  });
});

describe('GET /me', () => {
  it('get user information', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };
    (getUserInfo as jest.Mock).mockReturnValueOnce(userInfo);

    const res = await request(app).post('/login').send(payload).expect(201);
    const token = res.body.token;
    const resUserData = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(resUserData.body.email).toEqual(userInfo.email);
    expect(resUserData.body.name).toEqual(userInfo.name);
    expect(resUserData.body.picture).toEqual(userInfo.picture);
    expect(resUserData.body.unit).toEqual(userInfo.unit);
    expect(resUserData.body.role).toEqual(UserRole.USER);
  });

  it('missing token', async () => {
    const res = await request(app).get('/me').expect(403);
    expect(res.body.error).toEqual('Access token is required to access');
  });

  it('invalid token', async () => {
    const res = await request(app)
      .get('/me')
      .set('Authorization', `Bearer invalid`)
      .expect(401);
    expect(res.body.error).toEqual('Invalid token');
  });
});

describe('Protected /locations', () => {
  const locationData = {
    name: 'Test Location',
    latitude: 40.712776,
    longitude: -74.005974,
    radius: 1000,
  };

  it('protected create new location', async () => {
    const res = await request(app)
      .post('/locations')
      .send(locationData)
      .expect(403);

    const location = await Location.findOne({ name: locationData.name });
    expect(location).toBeNull();
    expect(res.body.error).toEqual('Access token is required to access');
  });

  it('protected delete location', async () => {
    const location = await Location.create(locationData);

    const res = await request(app)
      .delete(`/locations/${location._id}`)
      .expect(403);

    const updatedLocation = await Location.findById(location._id);
    expect(updatedLocation).not.toBeNull();
    expect(res.body.error).toEqual('Access token is required to access');
  });
});

describe('Protected /giveaways', () => {
  const giveawayData = {
    title: 'Test Giveaway',
    description: 'This is a test giveaway',
    numberOfWinners: 1,
    prize: 'Test prize',
  };

  it('protected create new giveaway', async () => {
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
      .expect(403);

    const giveaway = await Giveaway.findOne({ title: giveawayData.title });
    expect(giveaway).toBeNull();
    expect(giveawaysContract.methods.createGiveaway).not.toHaveBeenCalled();
  });

  it('protected add new participant', async () => {
    const giveaway = await Giveaway.create({
      ...giveawayData,
      startTime: new Date(Date.now() + 1000).toISOString(),
      endTime: new Date(Date.now() + 1500).toISOString(),
      image: 'test-image',
    });
    const payload = { id: 'participant@example.com', name: 'participant' };

    await request(app)
      .put(`/giveaways/${giveaway._id}/participants`)
      .send(payload)
      .expect(403);

    const updatedGiveaway = await Giveaway.findById(giveaway._id);
    expect(updatedGiveaway.participants.length).toEqual(0);
    expect(giveawaysContract.methods.addParticipant).not.toHaveBeenCalled();
  });
});
