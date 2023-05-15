export type Giveaway = {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  winners: string[];
  numberOfWinners: number;
  rules?: string;
  participants?: string[];
  requirements?: object;
  image?: string;
  prize?: string;
};
