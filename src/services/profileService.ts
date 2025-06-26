import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/profile';

// Types for profile updates
export type ProfilePreferences = {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
};

export type SubscriptionStatus = 'free' | 'pro' | 'pro_plus';

export type ProfileUpdate = Partial<{
  displayName: string;
  preferences: Partial<ProfilePreferences>;
  subscription: {
    status: SubscriptionStatus;
    expiresAt: Date | null;
  };
}>;

// Firestore converter for UserProfile type
const profileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile) => {
    return {
      accountId: profile.accountId,
      displayName: profile.displayName,
      email: profile.email,
      preferences: {
        theme: profile.preferences.theme,
        notifications: profile.preferences.notifications,
        language: profile.preferences.language
      },
      subscription: {
        status: profile.subscription.status,
        expiresAt: profile.subscription.expiresAt ? Timestamp.fromDate(profile.subscription.expiresAt) : null
      },
      createdAt: profile.createdAt instanceof Date ? Timestamp.fromDate(profile.createdAt) : profile.createdAt,
      updatedAt: profile.updatedAt instanceof Date ? Timestamp.fromDate(profile.updatedAt) : profile.updatedAt
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      accountId: data.accountId,
      displayName: data.displayName,
      email: data.email,
      preferences: {
        theme: data.preferences.theme,
        notifications: data.preferences.notifications,
        language: data.preferences.language
      },
      subscription: {
        status: data.subscription.status,
        expiresAt: data.subscription.expiresAt?.toDate?.() || null
      },
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
    } as UserProfile;
  }
};

const profilesCollection = collection(db, 'profiles').withConverter(profileConverter);

export const profileService = {
  async getProfile(accountId: string): Promise<UserProfile | null> {
    try {
      const profileRef = doc(profilesCollection, accountId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  async updateProfile(accountId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const profileRef = doc(profilesCollection, accountId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        // Update existing profile
        await updateDoc(profileRef, {
          ...updates,
          updatedAt: new Date()
        });
      } else {
        // Create new profile
        await setDoc(profileRef, {
          accountId,
          ...updates,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Get and return the updated profile
      const updatedSnap = await getDoc(profileRef);
      if (updatedSnap.exists()) {
        return updatedSnap.data();
      } else {
        throw new Error("Failed to retrieve profile after update.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async createProfile(accountId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const profileRef = doc(profilesCollection, accountId);
      await setDoc(profileRef, {
        accountId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async updateProfilePreferences(accountId: string, updates: ProfileUpdate): Promise<void> {
    try {
      const profileRef = doc(profilesCollection, accountId);
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating profile preferences:', error);
      throw error;
    }
  },

  async getProfilesBySubscriptionStatus(status: string): Promise<UserProfile[]> {
    const q = query(profilesCollection, where('subscription.status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }
}; 