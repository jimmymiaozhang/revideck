import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { profileService } from '../services/profileService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/profile';
import { CircularProgress, Box } from '@mui/material';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll for profile existence after sign-in
  const waitForProfile = async (accountId: string, maxTries = 20, delayMs = 1000): Promise<UserProfile | null> => {
    let userProfile = null;
    for (let i = 0; i < maxTries; i++) {
      userProfile = await profileService.getProfile(accountId);
      if (userProfile) {
        return userProfile;
      }
      await new Promise(res => setTimeout(res, delayMs));
    }
    return null;
  };

  // Poll for oauth connection existence after sign-in
  const waitForOauthConnection = async (email: string, maxTries = 20, delayMs = 1000): Promise<any | null> => {
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    for (let i = 0; i < maxTries; i++) {
      const oauthQuery = query(collection(db, 'oauth_connections'), where('email', '==', email));
      const oauthDocs = await getDocs(oauthQuery);
      if (!oauthDocs.empty) {
        const oauth = oauthDocs.docs[0].data();
        return oauth;
      }
      await new Promise(res => setTimeout(res, delayMs));
    }
    return null;
  };

  const refreshProfile = async () => {
    if (!currentUser?.email) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Poll for oauth connection
      const oauth = await waitForOauthConnection(currentUser.email);
      if (oauth) {
        // Poll for profile existence
        const userProfile = await waitForProfile(oauth.accountId);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setProfile(null);
          setError('Profile not found after sign-in. Please try reloading or contact support.');
        }
      } else {
        setProfile(null);
        setError('No oauth connection found for your account.');
      }
    } catch (err) {
      setProfile(null);
      setError('An error occurred while loading your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      refreshProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.email]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw' }}>
          <CircularProgress size={48} thickness={4} sx={{ color: '#222', mb: 2 }} />
          <div style={{ fontFamily: 'Roboto Flex', fontWeight: 100, fontSize: 20, marginTop: 16 }}>Loading your profile...</div>
        </Box>
      ) : (
        children
      )}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 