import { Stack } from '@mui/material';
import LoginCard from '../components/LoginCard';
import LoginImage from '../components/LoginImage';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <Stack
        sx={{ height: '100%' }}
        direction="row"
        spacing={'65px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <LoginCard />
        <LoginImage />
      </Stack>
    </div>
  );
};

export default LoginPage;
