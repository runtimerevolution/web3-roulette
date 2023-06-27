import { createContext } from 'react';

import { useQuery } from 'react-query';
import { Navigate, Outlet } from 'react-router-dom';

import ResponsiveAppBar from '../components/AppBar';
import { UserInfo } from '../lib/types';
import AuthClient from '../services/authclient';

const UserContext = createContext<UserInfo | null>(null);

const AuthRoute = () => {
  const { data: userInfo, isLoading } = useQuery<UserInfo | undefined>(
    'userInfo',
    AuthClient.getUserInfo,
    { staleTime: 0, cacheTime: 0 }
  );

  if (isLoading) {
    return <div></div>;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <UserContext.Provider value={userInfo}>
      <ResponsiveAppBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default AuthRoute;
export { UserContext };
