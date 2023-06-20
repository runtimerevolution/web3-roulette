import mongoose from 'mongoose';

import { Unit, User, UserRole } from '../models/user.model';

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

describe('User model', () => {
  it('create valid user', async () => {
    const userData = {
      email: 'name@domain.com',
      name: 'name user',
      unit: Unit.NODE,
    };

    const user = await User.create(userData);

    expect(user.email).toEqual(userData.email);
    expect(user.name).toEqual(userData.name);
    expect(user.unit).toEqual(Unit.NODE);
    expect(user.picture).toEqual('');
    expect(user.role).toEqual(UserRole.USER);
  });

  it('create user invalid unit', async () => {
    const userData = {
      email: 'name@domain.com',
      name: 'name user',
      unit: 'invalid',
    };

    try {
      await User.create(userData);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.errors.unit).toBeDefined();
    }
  });

  it('create user invalid role', async () => {
    const userData = {
      email: 'name@domain.com',
      name: 'name user',
      unit: Unit.NODE,
      role: 'invalid',
    };

    try {
      await User.create(userData);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.errors.role).toBeDefined();
    }
  });
});