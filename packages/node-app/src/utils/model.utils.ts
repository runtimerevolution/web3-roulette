import fs from 'fs';
import { Error as MongooseError } from 'mongoose';

import { ParticipantState } from '../models/giveaway.model';

type APIError = {
  code: number;
  message: object[] | string;
};

export const fileToBase64 = (file: Express.Multer.File): string => {
  const imageBuffer = fs.readFileSync(file.path);
  const imageBase64 = imageBuffer.toString('base64');
  return `data:${file.mimetype};base64,${imageBase64}`;
};

export const getDefinedFields = (
  obj: Record<string, any>
): Record<string, any> => {
  const definedFields: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      definedFields[key] = obj[key];
    }
  }

  return definedFields;
};

export const giveawayStats = (giveaway: any) => {
  const initialStats = {
    nrConfirmedParticipants: 0,
    nrPendingParticipants: 0,
  };

  for (const participant of giveaway.participants) {
    if (participant.state === ParticipantState.CONFIRMED) {
      initialStats.nrConfirmedParticipants++;
    } else if (participant.state === ParticipantState.PENDING) {
      initialStats.nrPendingParticipants++;
    }
  }

  return initialStats;
};

export const giveawayWinners = (giveaway: any) => {
  const participantMap = new Map<string, string>();

  for (const participant of giveaway.participants) {
    participantMap.set(participant.id, participant.name);
  }

  const winners = giveaway.winners.map((winner) => ({
    ...winner,
    name: participantMap.get(winner.id),
  }));

  return winners;
};

export const isGiveawayInvalid = (giveaway: any) => {
  let confirmedParticipants = 0;
  for (const participant of giveaway.participants) {
    if (participant.state === 'confirmed') confirmedParticipants++;
  }
  if (giveaway.endTime < new Date()) {
    if (giveaway.numberOfWinners > confirmedParticipants) return true;
  }
  return false;
};

export const handleError = (error: Error): APIError => {
  if (error instanceof MongooseError.ValidationError) {
    const message = Object.entries(error.errors).map(([field, error]) => ({
      field,
      message: error.message,
    }));
    return { code: 400, message };
  }
  return { code: 500, message: error.message };
};
