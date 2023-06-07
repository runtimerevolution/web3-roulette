import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { Stack, Typography } from '@mui/material';

import { Giveaway } from '../../lib/types';
import GiveawayCountdownBox from './CountdownBox';

const GiveawayCountdownCard = (giveaway: Giveaway) => {
  const navigate = useNavigate();

  const navigateDetails = () => {
    navigate(`/giveaways/${giveaway._id}`);
  };

  return (
    <Stack className="countdown-card" direction={'row'}>
      <img
        className="img clickable"
        src={giveaway.image}
        alt="giveaway thumb"
        onClick={navigateDetails}
      />
      <div className="info-container">
        <Typography variant="h5">{giveaway.title}</Typography>
        <Typography className="description">{giveaway.description}</Typography>
        <Typography className="trophy">
          <span role="img" aria-label="trophy">
            🏆
          </span>{' '}
          {giveaway.prize}
        </Typography>
        <Typography className="calendar">
          <span role="img" aria-label="calendar">
            🗓️
          </span>{' '}
          {format(giveaway.endTime, 'MMMM d, yyyy')}
        </Typography>
      </div>
      <GiveawayCountdownBox {...giveaway} />
    </Stack>
  );
};

export default GiveawayCountdownCard;
