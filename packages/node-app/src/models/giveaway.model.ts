import mongoose, { Schema } from 'mongoose';

enum Unit {
  NODE = 'node',
  RAILS = 'rails',
  PYTHON = 'python'
}

export interface Requirements {
  unit?: Unit;
  location?: mongoose.Types.ObjectId; // reference to Location model
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
  prize: string;
  image: string;
  rules?: string;
}

const giveawaySchema = new Schema<Giveaway>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (startTime: Date) {
        return startTime < this.endTime && startTime > new Date();
      },
      message: 'Start time must be less than end time and in the future'
    }
  },
  endTime: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (endTime: Date) {
        return endTime > this.startTime;
      },
      message: 'End time must be greater than start time'
    }
  },
  participants: [{ type: String, required: false }],
  numberOfWinners: { 
    type: Number, 
    required: true, 
    min: [1, 'Number of winners must be greater than 0']
  },
  requirements: {
    unit: { type: String, enum: Object.values(Unit), required: false },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: false },
  },
  prize: { type: String, required: true },
  image: { type: String, required: true },
  rules: { type: String, required: false },
}, { timestamps: true });

export const Giveaway = mongoose.model<Giveaway>('Giveaway', giveawaySchema);
