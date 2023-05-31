import { Button, Stack, Typography } from '@mui/material';

import { Participant } from '../../lib/types';

type ParticipantEntryProps = {
  participant: Participant;
  onUpdateState: (participantId: string, newState: string) => void;
};

const ParticipantEntry = ({
  participant,
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
          className="action-button reject"
          variant="contained"
          color="error"
          onClick={() => {
            onUpdateState(participant.id, 'rejected');
          }}
          disableElevation
        >
          Reject
        </Button>
        <Button
          className="action-button approve"
          variant="contained"
          color="success"
          onClick={() => {
            onUpdateState(participant.id, 'confirmed');
          }}
          disableElevation
        >
          Approve
        </Button>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
