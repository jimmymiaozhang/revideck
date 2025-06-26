export interface ProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export interface Subscription {
  status: 'free' | 'pro' | 'pro_plus';
  expiresAt: Date | null;
}

export interface UserProfile {
  accountId: string;
  displayName: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  subscription: {
    status: 'free' | 'pro' | 'pro_plus';
    expiresAt: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileUpdate = Partial<UserProfile>; 