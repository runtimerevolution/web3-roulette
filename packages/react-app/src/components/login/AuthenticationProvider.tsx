import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { User } from "../../lib/types";

const {
  VITE_GOOGLE_OAUTH_REDIRECT,
  VITE_GOOGLE_OAUTH_CLIENT_ID,
  VITE_API_URI
} = import.meta.env;

interface AuthenticationContextInterface {
  login: () => void;
  logout: () => void;
  user: User | undefined;
  loading: boolean;
}

export const AuthenticationContext = createContext<AuthenticationContextInterface>({
  login: () => { return; },
  logout: () => { return; },
  user: undefined,
  loading: false
})

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const authToken = searchParams.get('authToken');
  const authError = searchParams.get('authError');

  const login = () => {
    const googleAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: VITE_GOOGLE_OAUTH_REDIRECT,
      client_id: VITE_GOOGLE_OAUTH_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" ")
    };

    const qs = new URLSearchParams(options);
    window.location.replace(`${googleAuthURL}?${qs.toString()}`);
  }

  const getUser = (authToken: string) => {
    setLoading(true)  
    axios.get(`${VITE_API_URI}/authentication/user`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    }).then(response => {
      if (response.status === 200)
        setUser(response.data)
      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
      logout()
    })
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(undefined);
  }

  useEffect(() => {
    // on login
    if (authToken) {
      // save authToken in local storage
      localStorage.setItem('authToken', authToken)
      // update user in state
      getUser(authToken);
      // delete authToken from URL params
      searchParams.delete('authToken');
      setSearchParams(searchParams);
    }
  }, [authToken])

  useEffect(() => {
    // on login error
    if (authError) {
      setError(true)
      // delete authError from URL params
      searchParams.delete('authError');
      setSearchParams(searchParams);
    }
  }, [authError])

  useEffect(() => {
    // on update and already logged in
    const localAuthToken = localStorage.getItem('authToken');
    if (localAuthToken) getUser(localAuthToken);
    else setLoading(false)
  }, [])
  
  return (
    <AuthenticationContext.Provider value={{ login, logout, user, loading }}>
       <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(!error)}>
        <MuiAlert severity="error">
          Authentication failed. Please contact an admin for help.
        </MuiAlert>
      </Snackbar>
      {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationProvider;
