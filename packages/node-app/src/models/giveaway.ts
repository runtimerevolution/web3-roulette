import mongoose, { Schema } from 'mongoose';

enum Unit {
  NODE = 'node',
  RAILS = 'rails',
  PYTHON = 'python'
}

export interface Requirements {
  unit?: Unit;
}

interface Giveaway extends mongoose.Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
  winners: string[];
  numberOfWinners: number;
  requirements?: Requirements;
}

const giveawaySchema = new Schema<Giveaway>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  participants: [{ type: String, required: false }],
  winners: [{ type: String, required: true }],
  numberOfWinners: { type: Number, required: true },
  requirements: { type: Object, required: false, default: {} }
});

export default mongoose.model<Giveaway>('Giveaway', giveawaySchema);
