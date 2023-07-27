import { Stack } from '@mui/material';
import LoginCard from '../components/login/Card';
import LoginImage from '../components/login/Image';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <Stack
        sx={{ height: '100%' }}
        direction={{ xs: 'column', lg: 'row' }}
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
