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
      <Stack direction="row">
        <ChevronLeftIcon />
        <Typography>Back</Typography>
      </Stack>
      <Stack direction="row">
        <div>
          <Typography>{giveaway.title}</Typography>
          <img src={giveaway.image} alt={giveaway.title} />
          <Typography>{giveaway.description}</Typography>
          <Typography>
            <>🏆 {giveaway.prize}</>
          </Typography>
          <Typography>
            <>🗓️ {format(giveaway.endTime, 'MMMM d, yyyy')}</>
          </Typography>
        </div>
        {giveaway.rules && (
          <div>
            <Typography>Rules</Typography>
            <Typography>{giveaway.rules}</Typography>
          </div>
        )}
      </Stack>
    </>
  );
};

export default GiveawayDetailsPage;
export { loader };
