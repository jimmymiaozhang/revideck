import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Collapse,
  CircularProgress,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Avatar,
  IconButton
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { profileService } from '../services/profileService';
import { UserProfile, OAuthConnection } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { UserProfile as UserProfileType } from '../types/profile';

function formatExpiresAt(expiresAt: any) {
  if (!expiresAt) return '';
  if (expiresAt instanceof Date) return expiresAt.toLocaleDateString();
  if (typeof expiresAt.toDate === 'function') return expiresAt.toDate().toLocaleDateString();
  return '';
}

const AccountSettings = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const { currentUser } = useAuth();
  const { profile, setProfile, refreshProfile } = useProfile();

  // Helper function to get account ID from email
  const getAccountIdFromEmail = async (email: string): Promise<string> => {
    const oauthCollection = collection(db, 'oauth_connections');
    const oauthQuery = query(oauthCollection, where('email', '==', email));
    const oauthDocs = await getDocs(oauthQuery);

    if (oauthDocs.empty) {
      throw new Error('No account found');
    }

    const oauth = oauthDocs.docs[0].data() as OAuthConnection;
    return oauth.accountId;
  };

  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSaveProfile = async () => {
    if (!profile || !editedName.trim()) return;
    setSaveLoading(true);
    try {
      await profileService.updateProfile(profile.accountId, {
        displayName: editedName.trim()
      });
      await refreshProfile(); // Refresh the profile to update everywhere
      setIsEditingName(false);
      setError(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!profile) return;
    
    setSaveLoading(true);
    try {
      await profileService.updateProfile(profile.accountId, {
        preferences: profile.preferences
      });
      await refreshProfile(); // Refresh the profile to update everywhere
      setError(null);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof UserProfileType['preferences'], value: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: value
      }
    });
  };

  const buttonStyles = {
    justifyContent: 'flex-start',
    fontFamily: '"Roboto Flex"',
    fontWeight: 300,
    fontSize: '1.5rem',
    textTransform: 'none',
    p: 0,
    mb: 2,
    transition: 'color 0.1s',
    transformOrigin: 'left',
    color: '#999999',
    '&:hover': {
      bgcolor: 'transparent',
      color: '#000000'
    },
    '&:focus': {
      outline: 'none'
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
          px: { xs: 4, sm: 6, md: 8 },
          flex: 1
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#000000',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            mb: 4,
            width: '100%'
          }}
        >
          Account Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Dividing line */}
        <Box sx={{ borderBottom: '1px solid #000', mb: 2, width: '100%' }} />

        {/* Profile Section */}
        <Box sx={{ width: '100%' }}>
          <Button
            onClick={() => handleSectionClick('profile')}
            sx={buttonStyles}
          >
            Profile
          </Button>
          <Collapse in={openSection === 'profile'}>
            <Box sx={{ mb: 4 }}>
              {/* User ID */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ 
                  color: '#000000',
                  mb: 0.5,
                  fontFamily: '"Roboto Flex"',
                  fontWeight: 300
                }}>
                  User ID
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontFamily: '"Roboto Flex"',
                  fontWeight: 300
                }}>
                  {profile?.accountId || ''}
                </Typography>
              </Box>

              {/* Display Name */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ 
                  color: '#000000',
                  mb: 0.5,
                  fontFamily: '"Roboto Flex"',
                  fontWeight: 300
                }}>
                  Display Name
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  {isEditingName ? (
                    <>
                      <TextField
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        variant="standard"
                        size="small"
                        autoFocus
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            fontFamily: '"Roboto Flex"',
                            fontWeight: 300,
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        sx={{ color: 'primary.main' }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ 
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontFamily: '"Roboto Flex"',
                        fontWeight: 300
                      }}>
                        {profile?.displayName}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setIsEditingName(true)}
                        sx={{ 
                          color: 'text.secondary',
                          padding: 0,
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Dividing line */}
        <Box sx={{ borderBottom: '1px solid #000', mb: 2, width: '100%' }} />

        {/* Preferences Section */}
        <Box sx={{ width: '100%' }}>
          <Button
            fullWidth
            disableRipple
            onClick={() => handleSectionClick('preferences')}
            sx={{
              ...buttonStyles,
              color: openSection === 'preferences' ? '#000000' : '#999999',
            }}
          >
            Preferences
          </Button>
          <Collapse in={openSection === 'preferences'}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="theme-select-label" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>
                  Theme
                </InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={profile?.preferences.theme || 'system'}
                  label="Theme"
                  onChange={(e) => handlePreferenceChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                  sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}
                >
                  <MenuItem value="system" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>System</MenuItem>
                  <MenuItem value="light" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>Light</MenuItem>
                  <MenuItem value="dark" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>Dark</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="language-select-label" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>
                  Language
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  value={profile?.preferences.language || 'en'}
                  label="Language"
                  onChange={(e) => handlePreferenceChange('language', e.target.value as string)}
                  sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}
                >
                  <MenuItem value="en" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>English</MenuItem>
                  <MenuItem value="es" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>Español</MenuItem>
                  <MenuItem value="fr" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>Français</MenuItem>
                  <MenuItem value="de" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>Deutsch</MenuItem>
                  <MenuItem value="zh" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>中文</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={profile?.preferences.notifications || false}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  />
                }
                label="Enable Notifications"
                sx={{ 
                  '& .MuiFormControlLabel-label': {
                    fontFamily: '"Roboto Flex"',
                    fontWeight: 300,
                    color: openSection === 'preferences' ? '#000000' : '#999999'
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={handleSavePreferences}
                disabled={saveLoading}
                fullWidth
                sx={{
                  bgcolor: '#000000',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#333333'
                  },
                  fontFamily: '"Roboto Flex"',
                  fontWeight: 300,
                  textTransform: 'none',
                  borderRadius: '50px',
                }}
              >
                {saveLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Box>
          </Collapse>
        </Box>

        {/* Dividing line */}
        <Box sx={{ borderBottom: '1px solid #000', mb: 2, width: '100%' }} />

        {/* Subscription Section */}
        <Box sx={{ width: '100%' }}>
          <Button
            fullWidth
            disableRipple
            onClick={() => handleSectionClick('subscription')}
            sx={{
              ...buttonStyles,
              color: openSection === 'subscription' ? '#000000' : '#999999',
            }}
          >
            Subscription
          </Button>
          <Collapse in={openSection === 'subscription'}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 2, justifyContent: 'center', alignItems: 'stretch' }}>
              {[
                { key: 'free', label: 'Free', description: 'Basic access' },
                { key: 'pro', label: 'Pro', description: 'Pro features' },
                { key: 'pro_plus', label: 'Pro+', description: 'All features' }
              ].map(plan => {
                const isCurrent = profile?.subscription?.status === plan.key;
                return (
                  <Box
                    key={plan.key}
                    sx={{
                      flex: 1,
                      minWidth: 180,
                      bgcolor: isCurrent ? '#000' : '#fff',
                      color: isCurrent ? '#fff' : '#000',
                      border: isCurrent ? '2px solid #000' : '2px solid #ccc',
                      borderRadius: 3,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: isCurrent ? 4 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 700, mb: 1 }}>
                      {plan.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300, mb: 2 }}>
                      {plan.description}
                    </Typography>
                    {isCurrent && profile?.subscription?.expiresAt && (
                      <Typography variant="body2" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300, mb: 1 }}>
                        Expires: {formatExpiresAt(profile.subscription.expiresAt)}
                      </Typography>
                    )}
                    {isCurrent && (
                      <Typography variant="caption" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 500, letterSpacing: 1 }}>
                        Current Plan
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>

        {/* Dividing line */}
        <Box sx={{ borderBottom: '1px solid #000', mb: 2, width: '100%' }} />

        {/* Connected Accounts Section */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Button
            fullWidth
            disableRipple
            onClick={() => handleSectionClick('connected')}
            sx={{
              ...buttonStyles,
              color: openSection === 'connected' ? '#000000' : '#999999',
            }}
          >
            Connected Accounts
          </Button>
          <Collapse in={openSection === 'connected'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#DB4437' }}>G</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  fontFamily: '"Roboto Flex"', 
                  fontWeight: 300,
                  color: openSection === 'connected' ? '#000000' : '#999999'
                }}>
                  Google Account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>
                  {profile?.email}
                </Typography>
              </Box>
              <Typography variant="body2" color="success.main" sx={{ fontFamily: '"Roboto Flex"', fontWeight: 300 }}>
                Connected
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
};

export default AccountSettings; 