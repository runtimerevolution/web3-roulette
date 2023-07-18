import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Participant } from '../../../lib/types';
import { useState } from 'react';

type ParticipantEntryProps = {
  participant: Participant;
  actionAllowed: boolean;
  onUpdateState: (participantId: string, newState: string) => void;
};

const ParticipantEntry = ({
  participant,
  actionAllowed,
  onUpdateState,
}: ParticipantEntryProps) => {
  const [loadingStatus, setLoadingStatus] = useState<string>('no action');

  const onButtonClick = async(newLoadingStatus: string) => {
    setLoadingStatus(newLoadingStatus);
    await onUpdateState(participant.id, newLoadingStatus);
    setLoadingStatus('no action');
  }

  return (
    <Stack
      className="participant-entry-container"
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <Typography className="participant-name">{participant.name}</Typography>
      <Stack direction={'row'}>
        <LoadingButton
          className={`action-button reject ${!actionAllowed && 'disabled'}`}
          variant="contained"
          color="error"
          onClick={() => {
            onButtonClick('rejected')
          }}
          disableElevation
          disabled={!actionAllowed || loadingStatus !== 'no action'}
          loading={loadingStatus === 'rejected'}
        >
          {loadingStatus !=='rejected' && 'Reject'}
        </LoadingButton>
        <LoadingButton
          className={`action-button approve ${!actionAllowed && 'disabled'}`}
          variant="contained"
          color="success"
          onClick={() => {
            onButtonClick('confirmed')
          }}
          disableElevation
          disabled={!actionAllowed || loadingStatus !== 'no action'}
          loading={loadingStatus === 'confirmed'}
        >
          {loadingStatus !=='confirmed' && 'Approve'}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
