import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLoaderData, useParams } from 'react-router-dom';

import { Divider, Snackbar, Stack, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import ParticipantEntry from '../components/giveaways/participation/ParticipantEntry';
import SubHeader from '../components/SubHeader';
import useUserInfo from '../hooks/useUserInfo';
import { Giveaway, Participant, UserRole } from '../lib/types';
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
  const participantsData = useLoaderData() as Participant[];
  const { giveawayId } = useParams();
  const [giveaway, setGiveaway] = useState<Giveaway>();
  const [participants, setParticipants] = useState(participantsData);
  const [error, setError] = useState(false);

  const ended = useMemo(() => {
    if (!giveaway) return true;
    return giveaway.endTime < new Date();
  }, [giveaway]);

  useEffect(() => {
    if (giveawayId) {
      FrontendApiClient.getGiveaway(giveawayId).then((giveaway) => {
        setGiveaway(giveaway);
      });
    }
  }, [giveawayId]);

  const pendingParticipants = useMemo(() => {
    return participants.filter((p) => p.state === 'pending');
  }, [participants]);

  const updateParticipant = (participantId: string, newState: string) => {
    if (!giveawayId) return;

    FrontendApiClient.manageParticipant(
      giveawayId,
      participantId,
      newState,
      () => {
        setParticipants(participants.filter((p) => p.id !== participantId));
      },
      () => {
        setError(true);
      }
    );
  };

  const closeError = () => {
    setError(false);
  };

  if (userInfo?.role !== UserRole.ADMIN) {
    return <Navigate to={`/giveaways/${giveawayId}`} />;
  }

  return (
    <div>
      <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
        <MuiAlert severity="error" onClose={closeError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      <SubHeader />
      <Typography className="title">Participants</Typography>
      {pendingParticipants.length > 0 ? (
        <Stack
          className="pending-users-container"
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {pendingParticipants.map((participant) => (
            <ParticipantEntry
              key={participant.id}
              participant={participant}
              actionAllowed={!ended}
              onUpdateState={updateParticipant}
            />
          ))}
        </Stack>
      ) : (
        <Typography className="no-pending-participants-msg">
          There are no participants to validate.
        </Typography>
      )}
    </div>
  );
};

export default ParticipantsManagerPage;
export { loader };
