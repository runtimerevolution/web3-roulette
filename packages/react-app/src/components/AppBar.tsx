import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { googleLogout } from '@react-oauth/google';
import useUserInfo from '../hooks/useUserInfo';
import logo from './../assets/Logo.svg';
import GoogleAuthClient from '../services/googleauthclient';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    handleCloseUserMenu();
    googleLogout();
    GoogleAuthClient.removeUser();
    navigate('/login');
  };

  return (
    <Container
      maxWidth={false}
      className="app-bar-container"
      sx={{
        display: 'flex',
      }}
    >
      <Box className="nav-logo" component="a" href="/">
        <img src={logo} alt="Logo" />
      </Box>
      <Box className="profile-menu-container">
        <Stack direction="row" alignItems="center" spacing="8px">
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar
              src={userInfo?.picture ? userInfo?.picture : ''}
              alt={userInfo?.name}
            />
          </IconButton>
          <Typography
            sx={{
              fontSize: '16px',
              color: '#303136',
              display: { xs: 'none', sm: 'initial' },
            }}
          >
            {userInfo?.name}
          </Typography>
        </Stack>
        <Menu
          id="menu-appbar"
          className="mt-40"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key="Logout" onClick={logout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}

export default ResponsiveAppBar;
