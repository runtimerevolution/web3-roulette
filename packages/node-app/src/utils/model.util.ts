import fs from 'fs';
import { omit } from 'lodash';
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

export const setParticipantsStats = (giveaway: any) => {
  const nrConfirmedParticipants = giveaway.participants.filter(
    (p) => p.state === ParticipantState.CONFIRMED
  ).length;
  const nrPendingParticipants = giveaway.participants.filter(
    (p) => p.state === ParticipantState.PENDING
  ).length;

  return {
    ...omit(giveaway, ['participants']),
    nrConfirmedParticipants,
    nrPendingParticipants,
  };
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
