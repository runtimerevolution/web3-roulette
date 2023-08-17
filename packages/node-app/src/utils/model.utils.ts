import fs from 'fs';
import { Error as MongooseError } from 'mongoose';

import { ParticipantState, Giveaway } from '../models/giveaway.model';
import { decrypt, objectIdToBytes24 } from '../utils/web3.utils';
import { giveawaysContract } from '../contracts';
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

export const getActiveGiveaways = (giveaways, role) => {
  return giveaways?.filter((g) => {
    const isActive = !(
      g.endTime < new Date() && g.numberOfWinners >= g.participants.length
    );

    if (isGiveawayInvalid(g)) return false;

    const hasPendingWinners =
      g.manual && new Date() > g.endTime && g.winners.length === 0;

    if (role === UserRole.ADMIN && hasPendingWinners) return true;

    if (role !== UserRole.ADMIN && g.startTime > new Date()) return false;

    return isActive;
  });
};

export const getTotalGiveaways = (giveaways, role) => {
  if (role === UserRole.USER) {
    return giveaways.filter((g) => new Date() > g.startTime).length;
  }
  return giveaways.length;
};

export const handleGenerateWinners = async (g) => {
  const giveaway = await Giveaway.findById(g._id);

  await giveawaysContract.methods
    .generateWinners(objectIdToBytes24(giveaway._id))
    .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

  const winners = await giveawaysContract.methods
    .getWinners(objectIdToBytes24(giveaway._id))
    .call();

  const decryptedWinners = winners.map((winner) => ({ id: decrypt(winner) }));

  giveaway.winners = decryptedWinners;
  await giveaway.save();

  return { decryptedWinners };
};

export const getChangedFields = (oldGiveaway, newGiveaway) =>
  Object.keys(newGiveaway).reduce(
    (a, k) => (oldGiveaway[k] !== newGiveaway[k] && (a[k] = newGiveaway[k]), a),
    {}
  );
