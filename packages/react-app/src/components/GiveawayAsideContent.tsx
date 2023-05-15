import { useContext } from 'react';

import { Typography } from '@mui/material';

import { Giveaway } from '../lib/types';
import { GiveawayContext } from '../pages/details';

const GiveawayAsideContent = () => {
  const giveaway = useContext(GiveawayContext) as Giveaway;

  return giveaway.rules ? (
    <div className="giveaway-aside-info">
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#282655',
        }}
      >
        Rules
      </Typography>
      <Typography sx={{ fontSize: '16px', marginTop: '5px' }}>
        {giveaway.rules}
      </Typography>
    </div>
  ) : (
    <div></div>
  );
};

export default GiveawayAsideContent;
