import { Navigate, Outlet } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';
import ResponsiveAppBar from '../components/AppBar';

const AuthRoute = () => {
  const user = useUserInfo();

  return user && user.email ? (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ referrer: window.location.pathname }} />
  );
};

export default AuthRoute;
