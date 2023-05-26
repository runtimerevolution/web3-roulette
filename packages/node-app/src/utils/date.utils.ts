export const dateToSecondsTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

export const isoStringToSecondsTimestamp = (isoString: string): number => {
  const date = new Date(isoString);
  return dateToSecondsTimestamp(date);
};

export const hasEnded = (endTime: Date): boolean => {
  const currentTime = new Date();
  return currentTime >= endTime;
};
