import mongoose, { Schema } from 'mongoose';

export interface Location extends mongoose.Document {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const locationSchema = new Schema<Location>({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
});

export const Location = mongoose.model<Location>('Location', locationSchema);
