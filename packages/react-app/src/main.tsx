import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';

import { createTheme, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './app/app';
import queryClient from './lib/queryClient';
import Constants from './utils/Constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D6DF0',
    },
    secondary: {
      main: '#282655',
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <GoogleOAuthProvider clientId={Constants.OAUTH_CLIENT_ID}>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
