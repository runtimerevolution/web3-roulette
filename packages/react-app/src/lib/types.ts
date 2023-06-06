type Giveaway = {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  winners: Winner[];
  numberOfWinners: number;
  participants: Participant[];
  rules?: string;
  requirements?: Requirements;
  image: string;
  prize: string;
  manual?: boolean;
  nrConfirmedParticipants?: number;
  nrPendingParticipants?: number;
};

type UserInfo = {
  email: string;
  familyName: string;
  givenName: string;
  hd: string;
  id: string;
  locale: string;
  name: string;
  verifiedEmail: boolean;
  picture?: string;
  role?: UserRole;
  unit?: Unit;
};

type Participant = {
  id: string;
  notified: boolean;
  name: string;
  state: string;
};

type Winner = {
  id: string;
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

enum ParticipationState {
  CHECKING = 'checking',
  MANAGE = 'manage',
  PARTICIPATING = 'participating',
  PENDING = 'pending',
  ALLOWED = 'allowed',
  NOT_ALLOWED = 'notAllowed',
  REJECTED = 'rejected',
}

type ConditionType = 'unit' | 'location';
type ConditionValue = Unit | string | null;

type GiveawayCondition = {
  type: ConditionType;
  value: ConditionValue;
};

export {
  Giveaway,
  UserInfo,
  Requirements,
  Location,
  UserRole,
  Unit,
  ParticipationState,
  Participant,
  GiveawayCondition,
  ConditionType,
  ConditionValue,
};
