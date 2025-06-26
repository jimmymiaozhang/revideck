import { Box, Container, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import SignInModal from '../components/auth/SignInModal';
import UpgradeModal from '../components/auth/UpgradeModal';

const MapScanner = () => {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isPostLoginCheckNeeded, setIsPostLoginCheckNeeded] = useState(false);

  const { currentUser: user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const textStyles = {
    fontFamily: '"Roboto Flex"',
    fontWeight: 100
  };

  const performSubscriptionCheck = () => {
    if (profile && (profile.subscription?.status === 'pro' || profile.subscription?.status === 'pro_plus')) {
      window.open('/MS/tool', '_blank');
    } else {
      setUpgradeModalOpen(true);
    }
  };

  const handleOpenTool = () => {
    if (authLoading) return;
    if (user) {
      if (!profileLoading && profile) {
        performSubscriptionCheck();
      }
    } else {
      setSignInModalOpen(true);
    }
  };

  const handleSignInSuccess = () => {
    setIsPostLoginCheckNeeded(true);
    setSignInModalOpen(false);
  };

  useEffect(() => {
    if (isPostLoginCheckNeeded && !profileLoading && profile) {
      performSubscriptionCheck();
      setIsPostLoginCheckNeeded(false);
    }
  }, [isPostLoginCheckNeeded, profileLoading, profile]);

  return (
    <>
      <SignInModal 
        open={signInModalOpen} 
        onClose={() => setSignInModalOpen(false)}
        onSuccess={handleSignInSuccess}
      />
      <UpgradeModal 
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
      <Box sx={{ 
        width: '100%',
        pt: { xs: 4, sm: 6 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Container 
          maxWidth={false}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            px: { xs: 4, sm: 6, md: 8 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: { xs: 6, sm: 8 } }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                color: 'black',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                ...textStyles,
                width: 'auto',
                mb: 0
              }}
            >
              Map Scanner
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenTool}
              disabled={authLoading || (!!user && profileLoading)}
              sx={{
                bgcolor: 'white',
                color: 'black',
                border: '1.5px solid black',
                borderRadius: '999px',
                px: 1.5,
                py: 0.5,
                ml: 2,
                boxShadow: 'none',
                transition: 'background 0.2s, color 0.2s',
                textTransform: 'none',
                fontSize: '1.25rem',
                '&:hover': {
                  bgcolor: 'black',
                  color: 'white',
                  border: '1.5px solid black',
                  boxShadow: 'none'
                },
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                },
                ...textStyles
              }}
            >
              Launch Tool
            </Button>
          </Box>

          <Box
            sx={{
              width: '100%',
              minHeight: { xs: '250px', sm: '400px' },
              bgcolor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              borderRadius: '8px'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                ...textStyles
              }}
            >
              Demo Video Coming Soon
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              minHeight: { xs: '250px', sm: '400px' },
              bgcolor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              borderRadius: '8px'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                ...textStyles
              }}
            >
              Tutorial Video Coming Soon
            </Typography>
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              ...textStyles,
              fontStyle: 'italic'
            }}
          >
            Tool under development. Coming soon!
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default MapScanner; 