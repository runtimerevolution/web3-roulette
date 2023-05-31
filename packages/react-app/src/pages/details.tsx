import { createContext } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Stack } from '@mui/material';

import GiveawayAsideContent from '../components/giveaways/AsideContent';
import GiveawayMainContent from '../components/giveaways/MainContent';
import SubHeader from '../components/SubHeader';
import useUserInfo from '../hooks/useUserInfo';
import { Giveaway, Participant, UserRole } from '../lib/types';
import FrontendApiClient from '../services/backend';

type GiveawayDetailData = {
  giveaway: Giveaway;
  participants: Participant[];
};

const GiveawayContext = createContext<GiveawayDetailData | null>(null);

const loader = async ({ params }: any) => {
  const giveaway = await FrontendApiClient.getGiveaway(params.giveawayId);
  if (!giveaway) {
    throw new Response('', { status: 404, statusText: 'Giveaway not found.' });
  }
  const participants = await FrontendApiClient.getParticipants(giveaway._id);
  return { giveaway, participants };
};

const GiveawayDetailsPage = () => {
  const userInfo = useUserInfo();
  const giveawayData = useLoaderData() as GiveawayDetailData;

  return (
    <GiveawayContext.Provider value={giveawayData}>
      <SubHeader />
      <Stack
        justifyContent="center"
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
      >
        <GiveawayMainContent />
        {(giveawayData.giveaway.rules || userInfo?.role === UserRole.ADMIN) && (
          <GiveawayAsideContent />
        )}
      </Stack>
    </GiveawayContext.Provider>
  );
};

export default GiveawayDetailsPage;
export { loader, GiveawayContext, GiveawayDetailData };
