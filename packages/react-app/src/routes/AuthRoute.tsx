import { createContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import ResponsiveAppBar from '../components/AppBar';
import { UserInfo } from '../lib/types';
import GoogleAuthClient from '../services/googleauthclient';

const UserContext = createContext<UserInfo | null>(null);

const AuthRoute = () => {
  const user = GoogleAuthClient.getUser();

  if (!user || !user.email) {
    return (
      <Navigate to="/login" state={{ referrer: window.location.pathname }} />
    );
  }

  return (
    <UserContext.Provider value={user}>
      <ResponsiveAppBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default AuthRoute;
export { UserContext };
