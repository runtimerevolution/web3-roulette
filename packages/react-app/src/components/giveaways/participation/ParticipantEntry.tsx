import { Button, Stack, Typography } from '@mui/material';

import { Participant } from '../../../lib/types';

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
          Reject
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
          Approve
        </Button>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
