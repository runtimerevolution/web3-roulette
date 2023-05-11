import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../app';
import { Location } from '../models/location.model';

describe('Location Endpoints', () => {
  let locationId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URI);
  });
  
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new location', async () => {
    const newLocation = {
      name: 'Test Location',
      latitude: 40.712776,
      longitude: -74.005974,
      radius: 1000,
    };

    const response = await request(app)
      .post('/locations')
      .send(newLocation)
      .expect(201);

    expect(response.body.name).toEqual(newLocation.name);
    expect(response.body.latitude).toEqual(newLocation.latitude);
    expect(response.body.longitude).toEqual(newLocation.longitude);
    expect(response.body.radius).toEqual(newLocation.radius);

    locationId = response.body._id;
  });

  it('should update an existing location', async () => {
    const updatedLocation = {
      name: 'Updated Location',
      latitude: 41.878113,
      longitude: -87.629799,
      radius: 2000,
    };

    const response = await request(app)
      .put(`/locations/${locationId}`)
      .send(updatedLocation)
      .expect(200);

    expect(response.body.name).toEqual(updatedLocation.name);
    expect(response.body.latitude).toEqual(updatedLocation.latitude);
    expect(response.body.longitude).toEqual(updatedLocation.longitude);
    expect(response.body.radius).toEqual(updatedLocation.radius);
  });

  it('should delete an existing location', async () => {
    await request(app).delete(`/locations/${locationId}`).expect(204);

    const deletedLocation = await Location.findById(locationId);
    expect(deletedLocation).toBeNull();
  });

  it('should return a list of locations', async () => {
    const location1 = await Location.create({
      name: 'Location 1',
      latitude: 1.234,
      longitude: 2.345,
      radius: 100
    });
    const location2 = await Location.create({
      name: 'Location 2',
      latitude: 3.456,
      longitude: 4.567,
      radius: 200
    });

    const response = await request(app).get('/locations');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toEqual(location1.name);
    expect(response.body[1].name).toEqual(location2.name);
  });
});
