import { AppBar, Container, Toolbar, Button, Box, IconButton, Menu, MenuItem, Divider, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignInModal from './auth/SignInModal';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    console.log('Navigation profile updated:', profile?.displayName);
  }, [profile]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignInClick = () => {
    handleMenuClose();
    setIsSignInOpen(true);
  };

  const handleSignOut = () => {
    handleMenuClose();
    signOut();
    navigate('/');
  };

  const buttonBaseStyles = {
    color: '#999999',
    textTransform: 'none',
    transition: 'transform 0.1s, color 0.1s',
    fontFamily: '"Roboto Flex"',
    '&:hover': {
      transform: 'scale(1.3)',
      bgcolor: 'transparent',
      color: '#000000'
    },
    '&:focus': {
      outline: 'none',
      bgcolor: 'transparent'
    },
    '&:focus-visible': {
      outline: 'none',
      bgcolor: 'rgba(0, 0, 0, 0.04)'
    }
  };

  return (
    <>
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: '#f5f5f5', 
            boxShadow: 'none',
            width: '100%',
            alignItems: 'center',
            '& .MuiContainer-root': {
              padding: 0
            }
          }}
        >
        <Container 
          maxWidth={false}
          disableGutters
          sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Toolbar 
            disableGutters
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: { xs: '64px', sm: '72px' },
              position: 'relative',
              pl: 3,
              pr: 8,  // Increased right padding further
              maxWidth: '100vw',
              boxSizing: 'border-box'
            }}
          >
            <Button
              disableRipple
              onClick={() => navigate('/')}
              sx={{
                ...buttonBaseStyles,
                color: 'black',
                fontSize: { 
                  xs: '1.5rem',
                  sm: '1.75rem',
                  md: '2rem'
                },
                fontWeight: 200,
                minWidth: 'auto',
                p: { xs: 0.75, sm: 1, md: 1.5 },
                transformOrigin: 'center',  // Changed from 'left center' to 'center'
                '&:hover': {
                  transform: 'scale(1.1)',
                  bgcolor: 'transparent',
                  color: 'black'
                }
              }}
            >
              Nerdy.Archi
            </Button>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: { 
                xs: 1,
                sm: 1.5,
                md: 2,
                lg: 3
              },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              mx: 'auto',
              '& > button': {
                flex: '0 1 auto',
                minWidth: 'auto',
                px: {
                  xs: 0.25,
                  sm: 0.5,
                  md: 1
                },
                fontSize: { 
                  xs: '1.25rem',
                  sm: '1.5rem',
                  md: '1.75rem',
                  lg: '2rem'
                }
              }
            }}>
              <Button
                disableRipple
                onClick={() => navigate('/MS')}
                sx={{
                  ...buttonBaseStyles,
                  fontWeight: 100,
                  color: location.pathname === '/MS' ? '#000000' : '#999999',
                  '&:hover': {
                    transform: 'scale(1.5)',
                    bgcolor: 'transparent',
                    color: '#000000'
                  }
                }}
              >
                /MS
              </Button>
              <Button
                disableRipple
                onClick={() => navigate('/NM')}
                sx={{
                  ...buttonBaseStyles,
                  fontWeight: 100,
                  color: location.pathname === '/NM' ? '#000000' : '#999999',
                  '&:hover': {
                    transform: 'scale(1.5)',
                    bgcolor: 'transparent',
                    color: '#000000'
                  }
                }}
              >
                /NM
              </Button>
              <Button
                disableRipple
                onClick={() => navigate('/FG')}
                sx={{
                  ...buttonBaseStyles,
                  fontWeight: 100,
                  color: location.pathname === '/FG' ? '#000000' : '#999999',
                  '&:hover': {
                    transform: 'scale(1.5)',
                    bgcolor: 'transparent',
                    color: '#000000'
                  }
                }}
              >
                /FG
              </Button>
            </Box>
            
            <IconButton
              disableRipple
              onClick={handleMenuOpen}
              sx={{
                color: 'black',
                p: { xs: 1, sm: 1.5 },
                zIndex: 1,
                transition: 'transform 0.1s',
                transformOrigin: 'center',
                position: 'absolute',  // Changed to absolute
                right: '24px',  // Explicit right positioning
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
              <MenuIcon sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem' },
                display: 'block'  // Ensure icon displays properly
              }} />
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
                  onClick={() => {
                    window.open('/', '_blank');
                    handleMenuClose();
                  }}
                  sx={{ fontWeight: 900, color: 'black', fontFamily: '"Roboto Flex"', fontSize: '1.25rem', px: 3, mb: 0.5, letterSpacing: 0.5 }}
                >
                  Nerdy.Archi
                </MenuItem>
                <Divider />
                {!currentUser ? (
                  <>
                    <MenuItem onClick={handleSignInClick}>Sign in</MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {
                      handleMenuClose();
                      navigate('/about');
                    }}>
                      About Nerdy.Archi
                    </MenuItem>
                  </>
                ) : (
                  <>
                    {profile && (
                      <>
                        <MenuItem onClick={() => { 
                          handleMenuClose();
                          navigate('/account');
                        }}>
                          Account Settings
                        </MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { 
                          handleMenuClose();
                          navigate('/about');
                        }}>
                          About Nerdy.Archi
                        </MenuItem>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Toolbar placeholder to prevent content from hiding under fixed AppBar */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />

      <SignInModal 
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
};

export default Navigation; 