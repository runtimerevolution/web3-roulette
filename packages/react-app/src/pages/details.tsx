import { createContext, useRef } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';

import { Stack } from '@mui/material';

import GiveawayAsideContent from '../components/giveaways/AsideContent';
import GiveawayMainContent from '../components/giveaways/MainContent';
import SubHeader from '../components/SubHeader';
import { GetParticipants } from '../lib/queryClient';
import { Giveaway, ParticipationState } from '../lib/types';
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
  const revalidator = useRevalidator();
  const { data: participants, refetch } = GetParticipants(giveaway._id);
  const participationState = useRef<ParticipationState>();

  const onParticipationChange = (newState: ParticipationState) => {
    if (newState !== participationState.current) {
      if (participationState.current) {
        refetch();
        revalidator.revalidate();
      }
      participationState.current = newState;
    }
  };

  return (
    <GiveawayContext.Provider value={giveaway}>
      <SubHeader />
      <Stack
        justifyContent="center"
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
      >
        {participants && <GiveawayMainContent participants={participants} />}
        <GiveawayAsideContent onParticipationChange={onParticipationChange} />
      </Stack>
    </GiveawayContext.Provider>
  );
};

export default GiveawayDetailsPage;
export { loader, GiveawayContext };
