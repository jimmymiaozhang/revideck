import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Debug: Log API key
console.log('API Key being used:', "AIzaSyCpfRWAQAMX-A5lPu_DDY4SvnD_JGm4jbM");

// Debug: Log environment variables
console.log('Firebase Config Environment Variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});

// Types for our collections
export interface Account {
  id: string;  // This will be our unique user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthConnection {
  id: string;
  accountId: string;  // References the unique user ID
  provider: 'google' | 'facebook' | 'microsoft';  // Support for multiple providers
  providerUserId: string;  // The ID from the OAuth provider
  email: string;
  createdAt: Date;
}

export interface UserProfile {
  accountId: string;  // References the unique user ID
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

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzquApS_KCGerb2CPSlLIBITLZIO-VriM",
  authDomain: "revideck-8f5bd.firebaseapp.com",
  projectId: "revideck-8f5bd",
  storageBucket: "revideck-8f5bd.appspot.com",
  messagingSenderId: "475939436240",
  appId: "1:475939436240:web:c75b365e00219c995290d5",
  measurementId: "G-PZSJFKJ2GJ"
};

// Debug: Log full config
console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 