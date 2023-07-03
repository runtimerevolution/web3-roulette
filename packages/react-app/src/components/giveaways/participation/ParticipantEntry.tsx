import { Button, CircularProgress, Stack, Typography } from '@mui/material';

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
        <Button
          className={`action-button reject ${!actionAllowed && 'disabled'}`}
          variant="contained"
          color="error"
          onClick={() => {
            onUpdateState(participant.id, 'rejected');
          }}
          disableElevation
          disabled={!actionAllowed}
        >
          {isLoading === 'rejected'? <CircularProgress size='1.5rem'/> : 'Reject'}
        </Button>
        <Button
          className={`action-button approve ${!actionAllowed && 'disabled'}`}
          variant="contained"
          color="success"
          onClick={() => {
            onUpdateState(participant.id, 'confirmed');
          }}
          disableElevation
          disabled={!actionAllowed}
        >
          {isLoading === 'confirmed'? <CircularProgress size='1.5rem'/> : 'Approve'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
