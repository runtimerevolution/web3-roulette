type Giveaway = {
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
  status: string;
  rules?: string;
  requirements?: Requirements;
};

type UserInfo = {
  email: string;
  name: string;
  role: UserRole;
  units: Unit[];
  picture?: string;
};

type Participant = {
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

type Location = {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
};

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

enum Unit {
  NODE = 'node',
  RAILS = 'rails',
  PYTHON = 'python',
}

type Stats = {
  nrConfirmedParticipants: number;
  nrPendingParticipants: number;
};

enum ParticipationState {
  CHECKING = 'checking',
  MANAGE = 'manage',
  PARTICIPATING = 'participating',
  PENDING = 'pending',
  ALLOWED = 'allowed',
  NOT_ALLOWED = 'notAllowed',
  REJECTED = 'rejected',
  PENDING_WINNERS = 'pendingWinners',
}

type ConditionType = 'unit' | 'location';
type ConditionValue = Unit | string | null;

type GiveawayCondition = {
  type: ConditionType;
  value: ConditionValue;
};

enum GiveawayStatus {
  INVALID = 'invalid',
  FINISHED = 'finished',
  PENDING = 'pending',
  FUTURE = 'future',
  ONGOING = 'ongoing',
}

export {
  ConditionType,
  ConditionValue,
  Giveaway,
  GiveawayCondition,
  GiveawayStatus,
  Location,
  Participant,
  ParticipationState,
  Requirements,
  Unit,
  UserInfo,
  UserRole,
};
