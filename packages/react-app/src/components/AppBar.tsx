import { useState } from 'react';
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
import useUserInfo from '../hooks/useUserInfo';
import logo from './../assets/Logo.svg';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const userInfo = useUserInfo();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
              src={userInfo.picture ? userInfo.picture : ''}
              alt={userInfo.name}
            />
          </IconButton>
          <Typography
            sx={{ fontFamily: 'Mulish', fontSize: '16px', color: '#303136' }}
          >
            {userInfo.name}
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
          <MenuItem key="Logout" onClick={handleCloseUserMenu}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}

export default ResponsiveAppBar;
