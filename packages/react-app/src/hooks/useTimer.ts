import { useEffect, useState } from 'react';

const useTimer = (endDate: Date) => {
  const [timeLeft, setTimeleft] = useState(
    endDate.getTime() - new Date().getTime()
  );

  useEffect(() => {
    const setTimeleftInterval = setInterval(() => {
      setTimeleft(endDate.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(setTimeleftInterval);
  }, [endDate]);

  return splitTimeLeft(timeLeft);
};

const splitTimeLeft = (timeLeft: number) => {
  let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  days = Math.max(days, 0);
  hours = Math.max(hours, 0);
  minutes = Math.max(minutes, 0);
  seconds = Math.max(seconds, 0);

  return [hours + days * 24, minutes, seconds];
};

export default useTimer;
export { splitTimeLeft };
