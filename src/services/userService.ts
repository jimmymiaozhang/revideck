import { 
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { User, signInWithPopup, UserCredential } from 'firebase/auth';
import { db, auth, googleProvider } from '../config/firebase';
import { Account, OAuthConnection, UserProfile } from '../config/firebase';
import { profileService } from './profileService';

export class UserService {
  private accountsCollection = collection(db, 'accounts');
  private oauthCollection = collection(db, 'oauth_connections');
  private profilesCollection = collection(db, 'profiles');

  /**
   * Creates or retrieves an account for a user authenticated through OAuth
   */
  async handleOAuthUser(user: User): Promise<{ account: Account; profile: UserProfile }> {
    console.log('handleOAuthUser called with user:', user.email);
    
    try {
      // Add a small delay to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if user already has an OAuth connection
      const oauthQuery = query(this.oauthCollection, where('email', '==', user.email));
      const oauthDocs = await getDocs(oauthQuery);

      if (!oauthDocs.empty) {
        console.log('Existing user found, getting account and profile');
        const oauth = oauthDocs.docs[0].data() as OAuthConnection;
        const result = await this.getAccountAndProfile(oauth.accountId);
        
        if (!result) {
          throw new Error('Failed to get account and profile');
        }
        
        return result;
      }

      console.log('Creating new user account and profile');
      // Create new account, OAuth connection, and profile
      const account: Account = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const oauth: OAuthConnection = {
        id: crypto.randomUUID(),
        accountId: account.id,
        provider: this.getOAuthProvider(user.providerData[0]?.providerId),
        providerUserId: user.uid,
        email: user.email!,
        createdAt: new Date()
      };

      const profile: UserProfile = {
        accountId: account.id,
        displayName: user.displayName || 'Anonymous',
        email: user.email!,
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en'
        },
        subscription: {
          status: 'free',
          expiresAt: null
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Saving to Firestore:', { 
        accountId: account.id,
        oauthId: oauth.id,
        displayName: profile.displayName 
      });

      // Save everything to Firestore
      await setDoc(doc(this.accountsCollection, account.id), this.toFirestore(account));
      await setDoc(doc(this.oauthCollection, oauth.id), this.toFirestore(oauth));
      await setDoc(doc(this.profilesCollection, account.id), this.toFirestore(profile));
      
      console.log('Successfully saved all documents to Firestore');
      return { account, profile };
      
    } catch (error) {
      console.error('Error in handleOAuthUser:', error);
      throw error;
    }
  }

  async getAccountAndProfile(accountId: string): Promise<{ account: Account; profile: UserProfile }> {
    const accountDoc = await getDoc(doc(this.accountsCollection, accountId));
    const profileDoc = await getDoc(doc(this.profilesCollection, accountId));

    if (!accountDoc.exists() || !profileDoc.exists()) {
      throw new Error('Account or profile not found');
    }

    return {
      account: this.fromFirestore(accountDoc.data()) as Account,
      profile: this.fromFirestore(profileDoc.data()) as UserProfile
    };
  }

  /**
   * Retrieves a user's profile
   */
  async getUserProfile(accountId: string): Promise<UserProfile | null> {
    const profileDoc = await getDoc(doc(this.profilesCollection, accountId));
    return profileDoc.exists() ? this.fromFirestore(profileDoc.data()) as UserProfile : null;
  }

  /**
   * Updates a user's profile
   */
  async updateProfile(accountId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profileRef = doc(this.profilesCollection, accountId);
    await updateDoc(profileRef, {
      ...this.toFirestore(updates),
      updatedAt: new Date()
    });

    const profileDoc = await getDoc(profileRef);
    return this.fromFirestore(profileDoc.data()) as UserProfile;
  }

  /**
   * Links an additional OAuth provider to an existing account
   */
  async linkOAuthProvider(accountId: string, user: User): Promise<void> {
    const oauth: OAuthConnection = {
      id: crypto.randomUUID(),
      accountId,
      provider: this.getOAuthProvider(user.providerData[0]?.providerId),
      providerUserId: user.uid,
      email: user.email!,
      createdAt: new Date()
    };

    await setDoc(doc(this.oauthCollection, oauth.id), this.toFirestore(oauth));
  }

  private toFirestore(data: any): any {
    return JSON.parse(JSON.stringify(data), (key, value) => {
      if (value instanceof Date) {
        return Timestamp.fromDate(value);
      }
      return value;
    });
  }

  private fromFirestore(data: any): any {
    return JSON.parse(JSON.stringify(data), (key, value) => {
      if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
        return new Date(value.seconds * 1000);
      }
      return value;
    });
  }

  private getOAuthProvider(providerId: string | undefined): 'google' | 'facebook' | 'microsoft' {
    switch (providerId) {
      case 'google.com':
        return 'google';
      case 'facebook.com':
        return 'facebook';
      case 'microsoft.com':
        return 'microsoft';
      default:
        return 'google'; // Default to google as it's our primary provider
    }
  }

  async signInWithGoogle(): Promise<UserCredential> {
    console.log('Starting Google sign-in process');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful');
      return result;
    } catch (error) {
      console.error('Error in Google sign-in:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 