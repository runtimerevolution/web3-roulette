import mongoose, { Schema } from 'mongoose';

export interface Location extends mongoose.Document {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const locationSchema = new Schema<Location>({
  name: { type: String, required: true },
  latitude: {
    type: Number,
    required: true,
    min: [-90, 'Latitute should be a value larger or equal to –90'],
    max: [90, 'Latitute should be a value smaller or equal to 90'],
  },
  longitude: {
    type: Number,
    required: true,
    min: [-180, 'Longitude should be a value larger or equal to -180'],
    max: [180, 'Longitude should be a value smaller or equal to 180'],
  },
  radius: { type: Number, required: true },
});

export const Location = mongoose.model<Location>('Location', locationSchema);
