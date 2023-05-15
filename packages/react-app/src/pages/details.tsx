import { format } from 'date-fns';
import { useLoaderData } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Stack, Typography } from '@mui/material';

import { Giveaway } from '../lib/types';
import DuckdartClient from '../services/backend';

const loader = async ({ params }: any) => {
  const giveaway = (await DuckdartClient.getActiveGiveaways()).find(
    (giveaway: Giveaway) => giveaway.id === Number(params.giveawayId)
  );
  if (!giveaway) {
    throw new Response('', { status: 404, statusText: 'Giveaway not found.' });
  }
  return giveaway;
};

const GiveawayDetailsPage = () => {
  const giveaway = useLoaderData() as Giveaway;

  return (
    <>
      <Stack direction="row" spacing="10px" alignItems="center" ml="60px">
        <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
        <Typography sx={{ fontSize: '18px' }}>Back</Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" spacing="120px" mt="26px">
        <div>
          <Typography
            sx={{
              fontSize: '35px',
              fontWeight: 'bold',
              color: '#303136',
              marginTop: '13px',
            }}
          >
            {giveaway.title}
          </Typography>
          <img
            className="giveaway-img"
            src={giveaway.image}
            alt={giveaway.title}
          />
          <Typography
            sx={{
              fontSize: '16px',
              color: '#303136',
              width: '580px',
              marginTop: '20px',
            }}
          >
            {giveaway.description}
          </Typography>
          <Stack mt="14px" spacing="12px">
            <Typography sx={{ fontSize: '18px', color: '#303136' }}>
              <>
                <span
                  className="giveaway-info-icon"
                  role="img"
                  aria-label="trophy"
                >
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
        </div>
        {giveaway.rules && (
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
        )}
      </Stack>
    </>
  );
};

export default GiveawayDetailsPage;
export { loader };
