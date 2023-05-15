import { createContext } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Stack } from '@mui/material';

import GiveawayAsideContent from '../components/GiveawayAsideContent';
import GiveawayMainContent from '../components/GiveawayMainContent';
import SubHeader from '../components/SubHeader';
import { Giveaway } from '../lib/types';
import DuckdartClient from '../services/backend';

const GiveawayContext = createContext<Giveaway | null>(null);

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
    <GiveawayContext.Provider value={giveaway}>
      <SubHeader />
      <Stack direction="row" justifyContent="center" spacing="90px">
        <GiveawayMainContent />
        <GiveawayAsideContent />
      </Stack>
    </GiveawayContext.Provider>
  );
};

export default GiveawayDetailsPage;
export { loader, GiveawayContext };
