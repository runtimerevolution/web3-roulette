import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Stack, Typography } from '@mui/material';

const SubHeader = () => {
  return (
    <Stack direction="row" spacing="10px" alignItems="center" ml="60px">
      <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
      <Typography sx={{ fontSize: '18px' }}>Back</Typography>
    </Stack>
  );
};

export default SubHeader;
