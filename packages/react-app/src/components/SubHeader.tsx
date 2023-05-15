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
      className="clickable"
      direction="row"
      spacing="10px"
      alignItems="center"
      ml="75px"
      mt="30px"
      onClick={goBack}
    >
      <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
      <Typography sx={{ fontSize: '18px' }}>Back</Typography>
    </Stack>
  );
};

export default SubHeader;
