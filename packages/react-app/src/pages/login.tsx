import { Stack } from '@mui/material';
import LoginCard from '../components/LoginCard';
import LoginImage from '../components/LoginImage';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <Stack direction="row">
        <LoginCard />
        <LoginImage />
      </Stack>
    </div>
  );
};

export default LoginPage;
