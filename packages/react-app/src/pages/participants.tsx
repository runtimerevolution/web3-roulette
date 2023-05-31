import { useMemo } from 'react';
import { Navigate, useLoaderData, useParams } from 'react-router-dom';

import { Divider, Stack, Typography } from '@mui/material';

import ParticipantEntry from '../components/giveaways/ParticipantEntry';
import SubHeader from '../components/SubHeader';
import useUserInfo from '../hooks/useUserInfo';
import { Participant, UserRole } from '../lib/types';
import FrontendApiClient from '../services/backend';

const loader = async ({ params }: any) => {
  const participants = await FrontendApiClient.getParticipants(
    params.giveawayId
  );
  if (!participants) {
    throw new Response('', { status: 404, statusText: 'Giveaway not found.' });
  }
  return participants;
};

const ParticipantsManagerPage = () => {
  const userInfo = useUserInfo();
  const participants = useLoaderData() as Participant[];
  const { giveawayId } = useParams();

  const pendingParticipants = useMemo(() => {
    return participants.filter((p) => p.state === 'pending');
  }, [participants]);

  if (userInfo?.role !== UserRole.ADMIN) {
    return <Navigate to={`/giveaways/${giveawayId}`} />;
  }

  return (
    <div>
      <SubHeader />
      <Typography className="title">Participants</Typography>
      <Stack
        className="pending-users-container"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {pendingParticipants.map((participant) => (
          <ParticipantEntry {...participant} />
        ))}
      </Stack>
    </div>
  );
};

export default ParticipantsManagerPage;
export { loader };
