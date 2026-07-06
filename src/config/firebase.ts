import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNoqJQqAuV6XJDlrNm7-VWtW5t4BNOOrU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "study-tracker-db.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "study-tracker-db",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "study-tracker-db.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "504821518987",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:504821518987:web:1d9d716e2b4278d548fa8e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1E54QBLEWQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};
