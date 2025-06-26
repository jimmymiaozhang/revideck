import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const MapScannerToolNav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { profile } = useProfile();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignInClick = () => {
    handleMenuClose();
    navigate('/'); // You may want to open a sign-in modal or page
  };

  const handleSignOutAndClose = () => {
    handleMenuClose();
    signOut();
    window.close();
  };

  const handleHomeClick = () => {
    window.open('/', '_blank');
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#f5f5f5', boxShadow: 'none', px: 0 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: { xs: '64px', sm: '72px' }, pl: 3, pr: 8, maxWidth: '100vw', boxSizing: 'border-box' }}>
        <Typography
          variant="h5"
          sx={{
            color: 'black',
            fontFamily: '"Roboto Flex"',
            fontWeight: 200,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            minWidth: 'auto',
            p: { xs: 0.75, sm: 1, md: 1.5 },
            m: 0,
            userSelect: 'none',
            lineHeight: 1.1,
            letterSpacing: 0.5,
            transformOrigin: 'center',
          }}
        >
          Map Scanner
        </Typography>
        <Box>
          <IconButton
            disableRipple
            onClick={handleMenuOpen}
            sx={{
              color: 'black',
              p: { xs: 1, sm: 1.5 },
              zIndex: 1,
              transition: 'transform 0.1s',
              transformOrigin: 'center',
              position: 'relative',
              right: 0,
              '&:hover': {
                bgcolor: 'transparent',
                transform: 'scale(1.2)'
              },
              '&:focus': {
                outline: 'none',
                bgcolor: 'transparent'
              },
              '&:focus-visible': {
                outline: 'none',
                bgcolor: 'transparent'
              }
            }}
          >
            <MenuIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem' }, display: 'block' }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 2,
                minWidth: '240px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                '& .MuiMenuItem-root': {
                  fontFamily: '"Roboto Flex"',
                  fontSize: '1rem',
                  fontWeight: 100,
                  py: 1,
                  px: 3,
                  mx: 1.5,
                  borderRadius: '4px',
                  color: '#999999',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.1s',
                  listStyle: 'none',
                  '&::before': {
                    display: 'none'
                  },
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#000000'
                  }
                },
                '& .MuiDivider-root': {
                  my: 0.5,
                  mx: 2
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            disableAutoFocusItem
          >
            <Box sx={{ py: 1 }}>
              <MenuItem
                onClick={handleHomeClick}
                sx={{ fontWeight: 900, color: 'black', fontFamily: '"Roboto Flex"', fontSize: '1.25rem', px: 3, mb: 0.5, letterSpacing: 0.5 }}
              >
                Nerdy.Archi
              </MenuItem>
              <Divider />
              {!currentUser ? (
                <>
                  <MenuItem onClick={handleSignInClick}>Sign in</MenuItem>
                </>
              ) : (
                <>
                  {profile && (
                    <>
                      <MenuItem onClick={handleSignOutAndClose}>Sign out and close window</MenuItem>
                    </>
                  )}
                </>
              )}
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MapScannerToolNav; 