export type Giveaway = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  participants?: string[]
  winners: string[];
  numberOfWinners: number;
  requirements?: object;
  image?: string;
  prize?: string;
};
