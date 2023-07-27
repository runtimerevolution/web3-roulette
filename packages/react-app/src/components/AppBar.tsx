import { useContext, useState} from 'react';
import { Avatar, Box, Container, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import logo from '../assets/Logo.svg';
import { AuthenticationContext } from './login/AuthenticationProvider';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { logout, user } = useContext(AuthenticationContext);

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
              src={user.picture}
              alt={user.name}
              imgProps={{ referrerPolicy: 'no-referrer' }}
            />
          </IconButton>
          <Typography className='profile-name'>
            {user.name}
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
            <Typography className="center-text">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}

export default ResponsiveAppBar;
