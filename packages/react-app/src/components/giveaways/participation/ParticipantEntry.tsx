import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Participant } from '../../../lib/types';

type ParticipantEntryProps = {
  participant: Participant;
  actionAllowed: boolean;
  onUpdateState: (participantId: string, newState: string) => void;
  isLoading: string;
};

const ParticipantEntry = ({
  participant,
  actionAllowed,
  onUpdateState,
  isLoading,
}: ParticipantEntryProps) => {
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
          onClick={() => {
            onUpdateState(participant.id, 'rejected');
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
          onClick={() => {
            onUpdateState(participant.id, 'confirmed');
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
