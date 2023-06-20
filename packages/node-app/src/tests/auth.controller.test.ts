import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';
import { Unit, User, UserRole } from '../models/user.model';
import { getUserInfo } from '../utils/auth.util';

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
  jest.clearAllMocks();
});

describe('POST /login', () => {
  const userInfo = {
    email: 'example@domain.com',
    name: 'name',
    picture: 'picture',
    unit: Unit.NODE,
  };

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
