import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import App from './app/app';
import queryClient from './lib/queryClient';

const theme = createTheme({
  typography: {
    fontFamily: `"Mulish"`,
  },
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
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
