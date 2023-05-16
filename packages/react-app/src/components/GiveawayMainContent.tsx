import { format } from 'date-fns';
import { useContext } from 'react';

import { Stack, Typography } from '@mui/material';

import { Giveaway } from '../lib/types';
import { GiveawayContext } from '../pages/details';

const GiveawayMainContent = () => {
  const giveaway = useContext(GiveawayContext) as Giveaway;

  return (
    <Stack sx={{ paddingLeft: { sm: '80px', lg: '0px' } }}>
      <Typography
        sx={{
          fontSize: '35px',
          fontWeight: 'bold',
          color: '#303136',
          marginTop: '13px',
          marginLeft: { xs: '10px', md: '0px' },
        }}
      >
        {giveaway.title}
      </Typography>
      <img className="giveaway-img" src={giveaway.image} alt={giveaway.title} />
      <Typography
        sx={{
          fontSize: '16px',
          color: '#303136',
          width: '580px',
          marginTop: '20px',
          maxWidth: '95%',
          marginLeft: { xs: '10px', md: '0px' },
        }}
      >
        {giveaway.description}
      </Typography>
      <Stack mt="14px" spacing="12px">
        <Typography sx={{ fontSize: '18px', color: '#303136' }}>
          <>
            <span className="giveaway-info-icon" role="img" aria-label="trophy">
              🏆
            </span>{' '}
            {giveaway.prize}
          </>
        </Typography>
        <Typography sx={{ fontSize: '18px', color: '#303136' }}>
          <>
            <span
              className="giveaway-info-icon"
              role="img"
              aria-label="calendar"
            >
              🗓️
            </span>{' '}
            {format(giveaway.endTime, 'MMMM d, yyyy')}
          </>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default GiveawayMainContent;
