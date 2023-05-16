import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';

import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './app/app';
import queryClient from './lib/queryClient';
import Constants from './utils/Constants';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId={Constants.OAUTH_CLIENT_ID}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
