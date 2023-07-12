import { Stack, Typography } from '@mui/material';
import Confetti from '../../../assets/Confetti.png';
import CreateNewButton from '../../CreateNewButton';

const AdminEmptyState = () => {
  return (
    <Stack
      className="empty-state-container"
      justifyContent="center"
      alignItems="center"
    >
      <img className="img" src={Confetti} alt="Confetti" />
      <Typography className="welcome">WELCOME!</Typography>
      <Typography className="description">
        Start by creating your first giveaway
      </Typography>
      <div className="empty-state-create-new">
        <CreateNewButton />
      </div>
    </Stack>
  );
};

export default AdminEmptyState;
