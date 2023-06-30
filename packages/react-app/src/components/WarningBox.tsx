import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Typography,
} from '@mui/material';

type WarningBoxProps = {
  message: string;
};

const WarningBox = ({ message }: WarningBoxProps) => {
  return (
    <Box className="warning-box">
      <WarningIcon className="warning-box-icon" />
      <Typography className="warning-text">{message}</Typography>
    </Box>
  );
};

export default WarningBox;
