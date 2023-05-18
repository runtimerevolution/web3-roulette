type Giveaway = {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  winners: string[];
  numberOfWinners: number;
  rules?: string;
  participants?: string[];
  requirements?: Requirements;
  image?: string;
  prize?: string;
};

type UserInfo = {
  email: string;
  family_name: string;
  given_name: string;
  hd: string;
  id: string;
  locale: string;
  name: string;
  verified_email: boolean;
  picture?: string;
  role?: UserRole;
  unit?: Unit;
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

type ButtonConfig = {
  text: string;
  color: string;
  textColor: string;
  startIcon?: React.ReactNode;
  onClick?: (giveaway: Giveaway, userInfo: UserInfo) => void;
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
  MANAGE = 'manage',
  PARTICIPATING = 'participating',
  PENDING = 'pending',
  ALLOWED = 'allowed',
  NOT_ALLOWED = 'not_allowed',
}

export {
  Giveaway,
  UserInfo,
  Requirements,
  Location,
  UserRole,
  Unit,
  ParticipationState,
  ButtonConfig,
};
