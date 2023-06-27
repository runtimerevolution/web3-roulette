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

jest.mock('../utils/auth.util');
const mockedGetUserInfo = jest.mocked(getUserInfo);

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
  it('should login new user', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };

    mockedGetUserInfo.mockResolvedValueOnce(userInfo);
    const res = await request(app).post('/login').send(payload).expect(201);

    const user = await User.findOne({ email: userInfo.email });
    expect(res.body.token).toBeDefined();
    expect(user.name).toEqual(userInfo.name);
    expect(user.picture).toEqual(userInfo.picture);
    expect(user.unit).toEqual(userInfo.unit);
    expect(user.role).toEqual(UserRole.USER);
  });

  it('should not login with empty tokens', async () => {
    const payload = {};

    await request(app).post('/login').send(payload).expect(400);

    const user = await User.findOne({ email: userInfo.email });
    expect(user).toBeNull();
  });

  it('should not login undefined user info', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };

    mockedGetUserInfo.mockResolvedValueOnce(undefined);
    await request(app).post('/login').send(payload).expect(400);

    const user = await User.findOne({ email: userInfo.email });
    expect(user).toBeNull();
  });
});

describe('GET /me', () => {
  it('should get user information', async () => {
    const payload = {
      tokenType: 'bearer',
      accessToken: 'ngreobgrerteqkg',
    };
    mockedGetUserInfo.mockResolvedValueOnce(userInfo);

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

  it('should not get user information missing token', async () => {
    const res = await request(app).get('/me').expect(403);
    expect(res.body.error).toEqual('Access token is required to access');
  });

  it('should not get user information invalid token', async () => {
    const res = await request(app)
      .get('/me')
      .set('Authorization', `Bearer invalid`)
      .expect(401);
    expect(res.body.error).toEqual('Invalid token');
  });
});
