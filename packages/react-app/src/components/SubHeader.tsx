import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubHeader = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Stack
      className="back-btn clickable"
      direction="row"
      spacing="10px"
      alignItems="center"
      onClick={goBack}
    >
      <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
      <Typography sx={{ fontSize: '18px' }}>Back</Typography>
    </Stack>
  );
};

export default SubHeader;
