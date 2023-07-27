export type Giveaway = {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  winners: Winner[];
  numberOfWinners: number;
  participants: Participant[];
  image: string;
  prize: string;
  stats: Stats;
  manual: boolean;
  isInvalid: boolean;
  rules?: string;
  requirements?: Requirements;
  winningChance: number;
};

export type User = {
  email: string;
  name: string;
  role: UserRole;
  units: Unit[];
  picture?: string;
};

export type Participant = {
  id: string;
  notified: boolean;
  name: string;
  state: string;
};

type Winner = {
  id: string;
  name: string;
};

type Requirements = {
  unit?: Unit;
  location?: string;
};

export type Location = {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Unit {
  NODE = 'node',
  RAILS = 'rails',
  PYTHON = 'python',
}

type Stats = {
  nrConfirmedParticipants: number;
  nrPendingParticipants: number;
};

export enum ParticipationState {
  CHECKING = 'checking',
  MANAGE = 'manage',
  PARTICIPATING = 'participating',
  PENDING = 'pending',
  ALLOWED = 'allowed',
  NOT_ALLOWED = 'notAllowed',
  REJECTED = 'rejected',
  PENDING_WINNERS = 'pendingWinners',
}

export type ConditionType = 'unit' | 'location';
export type ConditionValue = Unit | string | null;

export type GiveawayCondition = {
  type: ConditionType;
  value: ConditionValue;
};

export enum GiveawayStatus {
  INVALID = 'invalid',
  FINISHED = 'finished',
  PENDING = 'pending',
  FUTURE = 'future',
  ONGOING = 'ongoing',
}
