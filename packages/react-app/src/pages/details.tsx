import { createContext } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Stack } from '@mui/material';

import GiveawayAsideContent from '../components/giveaways/AsideContent';
import GiveawayMainContent from '../components/giveaways/MainContent';
import SubHeader from '../components/SubHeader';
import { Giveaway } from '../lib/types';
import FrontendApiClient from '../services/backend';

const GiveawayContext = createContext<Giveaway | null>(null);

const loader = async ({ params }: any) => {
  const giveaway = await FrontendApiClient.getGiveaway(params.giveawayId);
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
      <Stack
        justifyContent="center"
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
      >
        <GiveawayMainContent />
        <GiveawayAsideContent />
      </Stack>
    </GiveawayContext.Provider>
  );
};

export default GiveawayDetailsPage;
export { loader, GiveawayContext };
