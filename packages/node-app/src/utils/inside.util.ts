import { Requirements } from "../models/giveaway.model"

// TODO: connect to inside database
export const getParticipantAddress = (participant: string): string => {
  return 'PARTICIPANT_ADDRESS';
}

export const isValidParticipant = (participant: string, requirements: Requirements): boolean => {
  return true;
}
