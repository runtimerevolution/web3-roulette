import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';
import { Location } from '../models/location.model';
import { authenticated, notAuthenticated } from './__utils__/helper.utils';

jest.mock('../middlewares/auth.middleware');

jest.mock('../middlewares/auth.middleware', () => ({
  verifyToken: (req, res, next) => {
    return next();
  },
  verifyAdmin: (req, res, next) => {
    return next();
  },
}));

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Location.deleteMany({});
});

describe('POST /locations', () => {
  const newLocation = {
    name: 'Test Location',
    latitude: 40.712776,
    longitude: -74.005974,
    radius: 1000,
  };

  it(
    'should create a new location while authenticated',
    authenticated(async () => {
      const response = await request(app)
        .post('/locations')
        .send(newLocation)
        .expect(201);

      expect(response.body.name).toEqual(newLocation.name);
      expect(response.body.latitude).toEqual(newLocation.latitude);
      expect(response.body.longitude).toEqual(newLocation.longitude);
      expect(response.body.radius).toEqual(newLocation.radius);
    })
  );

  it(
    'should not create new location while not authenticated',
    notAuthenticated(async () => {
      const res = await request(app)
        .post('/locations')
        .send(newLocation)
        .expect(401);

      const location = await Location.findOne({ name: newLocation.name });
      expect(location).toBeNull();
      expect(res.body.error).toEqual('Invalid token');
    })
  );
});

describe('POST /locations/:id', () => {
  it(
    'should update an existing location while authenticated',
    authenticated(async () => {
      const location = await Location.create({
        name: 'Location',
        latitude: 1.234,
        longitude: 2.345,
        radius: 100,
      });
      const updatedLocation = {
        name: 'Updated Location',
        latitude: 41.878113,
        longitude: -87.629799,
        radius: 2000,
      };

      const response = await request(app)
        .put(`/locations/${location._id}`)
        .send(updatedLocation)
        .expect(200);

      expect(response.body.name).toEqual(updatedLocation.name);
      expect(response.body.latitude).toEqual(updatedLocation.latitude);
      expect(response.body.longitude).toEqual(updatedLocation.longitude);
      expect(response.body.radius).toEqual(updatedLocation.radius);
    })
  );
});

describe('DELETE /locations/:id', () => {
  it(
    'should delete an existing location while authenticated',
    authenticated(async () => {
      const location = await Location.create({
        name: 'Location',
        latitude: 1.234,
        longitude: 2.345,
        radius: 100,
      });

      await request(app).delete(`/locations/${location._id}`).expect(204);

      const deletedLocation = await Location.findById(location._id);
      expect(deletedLocation).toBeNull();
    })
  );

  it(
    'should not delete location while not authenticated',
    notAuthenticated(async () => {
      const location = await Location.create({
        name: 'Location',
        latitude: 1.234,
        longitude: 2.345,
        radius: 100,
      });

      const res = await request(app)
        .delete(`/locations/${location._id}`)
        .expect(401);

      const updatedLocation = await Location.findById(location._id);
      expect(updatedLocation).not.toBeNull();
      expect(res.body.error).toEqual('Invalid token');
    })
  );
});

describe('GET /locations', () => {
  it(
    'should return a list of locations while authenticated',
    authenticated(async () => {
      const location1 = await Location.create({
        name: 'Location 1',
        latitude: 1.234,
        longitude: 2.345,
        radius: 100,
      });
      const location2 = await Location.create({
        name: 'Location 2',
        latitude: 3.456,
        longitude: 4.567,
        radius: 200,
      });

      const response = await request(app).get('/locations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toEqual(location1.name);
      expect(response.body[1].name).toEqual(location2.name);
    })
  );
});
