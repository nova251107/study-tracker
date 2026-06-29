import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNoqJQqAuV6XJDlrNm7-VWtW5t4BNOOrU",
  authDomain: "study-tracker-db.firebaseapp.com",
  projectId: "study-tracker-db",
  storageBucket: "study-tracker-db.firebasestorage.app",
  messagingSenderId: "504821518987",
  appId: "1:504821518987:web:1d9d716e2b4278d548fa8e",
  measurementId: "G-1E54QBLEWQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
