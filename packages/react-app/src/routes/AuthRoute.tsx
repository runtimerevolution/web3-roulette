import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import ResponsiveAppBar from '../components/AppBar';
import { AuthenticationContext } from '../components/login/AuthenticationProvider';

const AuthRoute = () => {
  const { user, loading } = useContext(AuthenticationContext);

  if (loading) return <div></div>; //TODO: add loading screen

  if (!user) return <Navigate to="/login" replace={true} />;

  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
};

export default AuthRoute;
