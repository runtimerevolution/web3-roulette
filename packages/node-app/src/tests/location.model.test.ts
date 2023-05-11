import mongoose from "mongoose";
import { Location } from '../models/location.model';

describe('Location Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URI);
  });
  
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Location.deleteMany({});
  });

  it('should create and save a new location', async () => {
    const locationData = {
      name: 'Test Location',
      latitude: 123.456,
      longitude: 789.012,
      radius: 1000,
    };

    const location = new Location(locationData);
    const savedLocation = await location.save();

    expect(savedLocation._id).toBeDefined();
    expect(savedLocation.name).toBe(locationData.name);
    expect(savedLocation.latitude).toBe(locationData.latitude);
    expect(savedLocation.longitude).toBe(locationData.longitude);
    expect(savedLocation.radius).toBe(locationData.radius);
  });

  it('should require the name field', async () => {
    try {
      const locationData = {
        latitude: 123.456,
        longitude: 789.012,
        radius: 1000,
      };

      const location = new Location(locationData);
      await location.validate();
    } catch (error) {
      expect(error.errors.name).toBeDefined();
      expect(error.errors.name.message).toBe('Path `name` is required.');
    }
  });

  it('should require the latitude field', async () => {
    try {
      const locationData = {
        name: 'Test Location',
        longitude: 789.012,
        radius: 1000,
      };

      const location = new Location(locationData);
      await location.validate();
    } catch (error) {
      expect(error.errors.latitude).toBeDefined();
      expect(error.errors.latitude.message).toBe('Path `latitude` is required.');
    }
  });

  it('should require the longitude field', async () => {
    try {
      const locationData = {
        name: 'Test Location',
        latitude: 123.456,
        radius: 1000,
      };

      const location = new Location(locationData);
      await location.validate();
    } catch (error) {
      expect(error.errors.longitude).toBeDefined();
      expect(error.errors.longitude.message).toBe('Path `longitude` is required.');
    }
  });

  it('should require the radius field', async () => {
    try {
      const locationData = {
        name: 'Test Location',
        latitude: 123.456,
        longitude: 789.012,
      };

      const location = new Location(locationData);
      await location.validate();
    } catch (error) {
      expect(error.errors.radius).toBeDefined();
      expect(error.errors.radius.message).toBe('Path `radius` is required.');
    }
  });
});
