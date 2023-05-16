import './login.scss';

import { useState } from 'react';

import { Snackbar, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import LoginCard from '../components/LoginCard';
import LoginImage from '../components/LoginImage';

const LoginPage = () => {
  const [googleAuthError, setGoogleAuthError] = useState(false);

  const handleAuthError = () => {
    setGoogleAuthError(true);
  };

  const closeAuthError = () => {
    setGoogleAuthError(false);
  };

  return (
    <div className="login-page-container">
      <Snackbar
        open={googleAuthError}
        autoHideDuration={6000}
        onClose={closeAuthError}
      >
        <MuiAlert severity="error" onClose={closeAuthError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      <Stack
        sx={{ height: '100%' }}
        direction={{ xs: 'column', lg: 'row' }}
        spacing={'65px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <LoginCard handleAuthError={handleAuthError} />
        <LoginImage />
      </Stack>
    </div>
  );
};

export default LoginPage;
