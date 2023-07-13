import mongoose, { Schema } from 'mongoose';

import { Unit } from './user.model';

export interface Requirements {
  unit?: Unit;
  location?: mongoose.Types.ObjectId; // reference to Location model
}

export enum ParticipantState {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export interface Participant {
  id: string;
  name: string;
  state: ParticipantState;
  notified?: boolean;
}

interface Giveaway extends mongoose.Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  participants: Participant[];
  winners: string[];
  numberOfWinners: number;
  requirements?: Requirements;
  prize: string;
  image: string;
  rules?: string;
  manual: boolean;
}

const giveawaySchema = new Schema<Giveaway>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (startTime: Date) {
          if (this.isNew)
            return startTime < this.endTime && startTime > new Date();
          return true;
        },
        message: 'Start time must be less than end time and in the future',
      },
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (endTime: Date) {
          return endTime > this.startTime;
        },
        message: 'End time must be greater than start time',
      },
    },
    participants: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        state: {
          type: String,
          enum: Object.values(ParticipantState),
          required: true,
        },
        notified: { type: Boolean, required: false, default: false },
      },
    ],
    winners: [
      {
        id: { type: String, required: true },
      },
    ],
    numberOfWinners: {
      type: Number,
      required: true,
      min: [1, 'Number of winners must be greater than 0'],
    },
    requirements: {
      unit: { type: String, enum: Object.values(Unit), required: false },
      location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: false,
      },
    },
    prize: { type: String, required: true },
    image: { type: String, required: true },
    rules: { type: String, required: false },
    manual: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

export const Giveaway = mongoose.model<Giveaway>('Giveaway', giveawaySchema);
