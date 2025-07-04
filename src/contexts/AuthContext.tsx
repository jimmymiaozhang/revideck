import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import { UserProfile } from '../types/profile';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const authInProgress = useRef(false);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user && !authInProgress.current) {
        try {
          authInProgress.current = true;
          const { profile } = await userService.handleOAuthUser(user);
          setProfile(profile);
        } finally {
          authInProgress.current = false;
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      authInProgress.current = true;
      await userService.signInWithGoogle();
    } finally {
      authInProgress.current = false;
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setCurrentUser(null);
    setProfile(null);
  };

  const value = {
    currentUser,
    profile,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
} 