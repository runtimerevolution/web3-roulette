import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google';

import google from '../../assets/google.svg';
import logo from '../../assets/Logo.svg';
import AuthClient from '../../services/authclient';

const GoogleAuthButton = styled(Button)({
  color: '#171717',
  borderColor: '#000000',
  height: '35px',
  width: '60%',
  textTransform: 'none',
  fontSize: '17px',
  marginTop: '30px',
  borderWidth: '2px',
});

type LoginCardProps = {
  handleAuthError: () => void;
};

const LoginCard = ({ handleAuthError }: LoginCardProps) => {
  const navigate = useNavigate();

  const handleSuccess = async (
    res: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
  ) => {
    const tokenType = res.token_type;
    const accessToken = res.access_token;
    const apiToken = await AuthClient.login(tokenType, accessToken);

    if (!apiToken) {
      handleAuthError();
      return;
    }

    AuthClient.saveTokens(apiToken);
    navigate('/');
  };

  const handleError = (
    error: Pick<TokenResponse, 'error' | 'error_description' | 'error_uri'>
  ) => {
    console.log(error);
    handleAuthError();
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <Card
      className="login-card"
      sx={{ borderRadius: { xs: '0px', sm: '20px' } }}
      elevation={0}
    >
      <div>
        <Stack alignItems="center">
          <img className="logo" src={logo} alt="logo" />
        </Stack>
        <Stack
          sx={{ marginTop: { xs: '60px', sm: '80px' } }}
          alignItems="center"
        >
          <Stack direction="row">
            <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>
              WELCOME!
            </Typography>
            <span className="fs-30 ml-10" role="img" aria-label="wave emoji">
              👋
            </span>
          </Stack>
          <Typography
            className="login-sentence"
            variant="body1"
            sx={{ fontSize: '17px' }}
          >
            Unlock exclusive giveaways and rewards by logging in to our app. Let
            the excitement begin!
          </Typography>
          <GoogleAuthButton
            variant="outlined"
            startIcon={<img className="w-20" src={google} alt="google" />}
            onClick={() => {
              login();
            }}
          >
            Sign in with Google
          </GoogleAuthButton>
        </Stack>
      </div>
    </Card>
  );
};

export default LoginCard;
