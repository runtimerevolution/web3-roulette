import { useNavigate } from 'react-router-dom';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Stack } from '@mui/material';

import Hourglass from '../../assets/Hourglass.png';
import useTimer from '../../hooks/useTimer';
import { Giveaway } from '../../lib/types';

const GiveawayCountdownBox = (giveaway: Giveaway) => {
  const navigate = useNavigate();
  const [hours, minutes, seconds] = useTimer(giveaway.endTime);

  const navigateDetails = () => {
    navigate(`/giveaways/${giveaway._id}`);
  };

  return (
    <div className="countdown-box">
      <Stack
        className="timer-container"
        direction="row"
        justifyContent={'center'}
        alignItems={'center'}
        spacing={'5px'}
      >
        <div className="square">{Math.floor((hours / 10) % 10)}</div>
        <div className="square">{Math.floor(hours % 10)}</div>
        <div>:</div>
        <div className="square">{Math.floor((minutes / 10) % 10)}</div>
        <div className="square">{Math.floor(minutes % 10)}</div>
        <div>:</div>
        <div className="square">{Math.floor((seconds / 10) % 10)}</div>
        <div className="square">{Math.floor(seconds % 10)}</div>
      </Stack>
      <Stack direction={'row'} alignItems={'end'}>
        <Button
          className="watch-giveaway-btn"
          variant="text"
          endIcon={<ChevronRightIcon />}
          onClick={navigateDetails}
        >
          Watch giveaway
        </Button>
        <img className="hourglass-img" src={Hourglass} alt="Hourglass" />
      </Stack>
    </div>
  );
};

export default GiveawayCountdownBox;
