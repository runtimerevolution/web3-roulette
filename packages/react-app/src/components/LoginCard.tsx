import { Button, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGoogleLogin } from '@react-oauth/google';
import google from '../assets/google.svg';
import logo from '../assets/Logo.svg';

const GoogleAuthButton = styled(Button)({
  color: '#171717',
  borderColor: '#000000',
  height: '35px',
  width: '60%',
  fontFamily: 'Inter',
  textTransform: 'none',
  fontSize: '17px',
  marginTop: '30px',
  borderWidth: '2px',
});

const LoginCard = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: (error) => console.log(error),
  });

  return (
    <Card className="login-card" sx={{ borderRadius: '20px' }} elevation={0}>
      <Stack alignItems="center" mt={'70px'}>
        <img className="logo" src={logo} alt="logo" />
      </Stack>
      <Stack mt="80px" alignItems="center">
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
          Lorem ipsum dolor sit amet consectetur. Fermentum lacus in eget nulla
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
    </Card>
  );
};

export default LoginCard;
