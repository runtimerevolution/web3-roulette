import { Button, Stack, Typography } from '@mui/material';

import { Participant } from '../../lib/types';

const ParticipantEntry = (participant: Participant) => {
  return (
    <Stack
      className="participant-entry-container"
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Typography className="participant-name">{participant.name}</Typography>
      <Stack direction={'row'}>
        <Button
          className="action-button reject"
          variant="contained"
          color="error"
          disableElevation
        >
          Reject
        </Button>
        <Button
          className="action-button approve"
          variant="contained"
          color="success"
          disableElevation
        >
          Approve
        </Button>
      </Stack>
    </Stack>
  );
};

export default ParticipantEntry;
