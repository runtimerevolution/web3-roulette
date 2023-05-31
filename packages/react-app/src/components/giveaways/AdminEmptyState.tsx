import { Stack, Typography } from '@mui/material';
import Confetti from '../../assets/Confetti.png';
import CreateNewButton from '../CreateNewButton';

const AdminEmptyState = () => {
  return (
    <Stack
      className="empty-state-admin"
      justifyContent="center"
      alignItems="center"
    >
      <img className="confetti-img" src={Confetti} alt="Confetti" />
      <Typography className="welcome-text">WELCOME!</Typography>
      <Typography className="create-first-giveaway-text">
        Start by creating your first giveaway
      </Typography>
      <div style={{ paddingTop: '42px' }}>
        <CreateNewButton />
      </div>
    </Stack>
  );
};

export default AdminEmptyState;
