import mongoose, { Schema } from 'mongoose';

import { Unit } from './user.model';

enum Action {
  CREATE_GIVEAWAY = 'create-giveaway',
  UPDATE_GIVEAWAY = 'update-giveaway',
  ADD_PARTICIPANT = 'add-giveaway-participant',
  UPDATE_PARTICIPANT = 'update-giveaway-participant',
  GENERATE_WINNERS = 'generate-giveaway-winners',
}

interface Changes extends mongoose.Document {
  title?: string;
  description?: string;
  prize?: string;
  rules?: string;
  image?: string;
}

interface GiveawayLog extends mongoose.Document {
  action: Action;
  author: string;
  giveaway_id: string;
  changes: Changes;
}

const giveawayLogSchema = new Schema<GiveawayLog>(
  {
    action: { type: String, required: true },
    author: { type: String, required: true },
    giveaway_id: { type: String, required: true },
    changes: {
      title: { type: String, required: false },
      description: { type: String, required: false },
      prize: { type: String, required: false },
      rules: { type: String, required: false },
      image: { type: String, required: false },
    },
  },
  { timestamps: true }
);

export const GiveawayLog = mongoose.model<GiveawayLog>(
  'GiveawayLog',
  giveawayLogSchema
);
