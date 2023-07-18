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
  const [isLoading, setIsLoading] = useState<string>('no action');
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
          sx={{
            backgroundColor: '#DBDBFB',
            color: '#6D6DF0',
    
            '&.Mui-disabled': {
              background: '#6D6DF0',
              color: 'white',
            },
          }}
          color="error"
          onClick={async () => {
            setIsLoading('rejected');
            await onUpdateState(participant.id, 'rejected');
            setIsLoading('no action');
          }}
          disableElevation
          disabled={!actionAllowed || isLoading !== 'no action'}
          loading={isLoading === 'rejected'}
        >
          {isLoading !=='rejected' && 'Reject'}
        </LoadingButton>
        <LoadingButton
          className={`action-button approve ${!actionAllowed && 'disabled'}`}
          variant="contained"
          color="success"
          sx={{
            backgroundColor: '#DBDBFB',
            color: '#6D6DF0',
    
            '&.Mui-disabled': {
              background: '#6D6DF0',
              color: 'white',
            },
          }}
          onClick={async () => {
            setIsLoading('confirmed');
            await onUpdateState(participant.id, 'confirmed');
            setIsLoading('no action');
          }}
          disableElevation
          disabled={!actionAllowed || isLoading !== 'no action'}
          loading={isLoading === 'confirmed'}
        >
          {isLoading !=='confirmed' && 'Approve'}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
