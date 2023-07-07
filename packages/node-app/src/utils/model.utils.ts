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

export const giveawayStatus = (giveaway: any) => {
  if (giveaway.endTime < new Date()) {
    if (
      giveaway.participants.length <= 0 ||
      giveaway.numberOfWinners > giveaway.participants.length
    )
      return 'invalid';
    if (giveaway.winners.length > 0) return 'finished';
    return 'pending';
  }
  if (giveaway.startTime > new Date()) return 'future';
  return 'ongoing';
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

export const giveawayWinningChance = (email, stats, participants, giveaway) => {
  const { nrConfirmedParticipants } = stats;
  if (nrConfirmedParticipants === 0) return 100;

  const isRegistered = participants.some(
    (p) => p.id === email && p.state === 'confirmed'
  );
  const totalParticipants = isRegistered
    ? nrConfirmedParticipants
    : nrConfirmedParticipants + 1;
  const winningChance = Math.floor(
    (giveaway.numberOfWinners / totalParticipants) * 100
  );

  return Math.min(winningChance, 100);
};
