import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { profileService } from '../services/profileService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/profile';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const refreshProfile = async () => {
    if (!currentUser?.email) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Refreshing profile for:', currentUser.email);
      const oauthQuery = query(collection(db, 'oauth_connections'), where('email', '==', currentUser.email));
      const oauthDocs = await getDocs(oauthQuery);
      
      if (!oauthDocs.empty) {
        const oauth = oauthDocs.docs[0].data();
        const userProfile = await profileService.getProfile(oauth.accountId);
        console.log('Profile refreshed successfully:', userProfile?.displayName);
        setProfile(userProfile);
      } else {
        console.log('No oauth connection found for:', currentUser.email);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile when currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      console.log('Current user changed, refreshing profile for:', currentUser.email);
      refreshProfile();
    } else {
      console.log('No current user, clearing profile');
      setProfile(null);
      setLoading(false);
    }
  }, [currentUser?.email]);

  const value = {
    profile,
    loading,
    setProfile,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
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