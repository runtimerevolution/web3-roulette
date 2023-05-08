import { Navigate, Outlet } from 'react-router-dom'
import ResponsiveAppBar from '../components/AppBar';

const AuthRoute = () => {
  // const token = sessionStorage.getItem('token');
  // return token ? <Outlet /> : <Navigate to="/login" state={{ referrer: window.location.pathname }}/>

  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  )
};

export default AuthRoute;
