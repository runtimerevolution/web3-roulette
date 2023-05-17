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

type Requirements = {
  unit?: Unit;
  location?: Location;
};

type Location = {
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

export { Giveaway, Requirements, Location, UserRole, Unit };
