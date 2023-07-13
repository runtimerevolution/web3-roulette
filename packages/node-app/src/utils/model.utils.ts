import fs from 'fs';
import { Error as MongooseError } from 'mongoose';

import { ParticipantState } from '../models/giveaway.model';
import { UserRole } from '../models/user.model';

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
const nextGiveaway = (giveaways) => {
  const activeGiveaways = giveaways.filter(
    (g) => g.startTime < new Date() && new Date() < g.endTime
  );
  if (activeGiveaways.length === 0) return;

  return activeGiveaways.reduce((prev, curr) =>
    prev.endTime < curr.endTime ? prev : curr
  );
};

export const getActiveGiveaways = (giveaways, role) => {
  const countdownGiveaway = nextGiveaway(giveaways);
  return giveaways?.filter((g) => {
    const status =
      g.endTime < new Date() &&
      (g.participants.length <= 0 || g.numberOfWinners > g.participants.length)
        ? false
        : true;
    const hasPendingWinners =
      g.manual && new Date() > g.endTime && g.winners.length === 0
        ? true
        : false;

    if (role !== UserRole.ADMIN && g.startTime > new Date()) return false;

    if (role === UserRole.ADMIN && hasPendingWinners) return true;

    if (g._id === countdownGiveaway?._id) return false;

    return status;
  });
};
