import { Button, Stack, Typography } from '@mui/material';

type ParticipantEntryProps = {
  id: string;
  name: string;
};

const ParticipantEntry = ({ id, name }: ParticipantEntryProps) => {
  return (
    <Stack
      className="participant-entry-container"
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Typography className="participant-name">{name}</Typography>
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
