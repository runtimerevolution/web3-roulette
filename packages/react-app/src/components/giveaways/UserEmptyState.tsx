import { Stack, Typography } from '@mui/material';
import HappyFace from '../../assets/HappyFace.png';

const UserEmptyState = () => {
  return (
    <Stack
      className="empty-state-container"
      justifyContent="center"
      alignItems="center"
    >
      <img className="img" src={HappyFace} alt="Happy face" />
      <Typography className="welcome">WELCOME!</Typography>
      <Typography className="description">
        There are no giveaways available yet, please come back later.
      </Typography>
    </Stack>
  );
};

export default UserEmptyState;
