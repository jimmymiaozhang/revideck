import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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