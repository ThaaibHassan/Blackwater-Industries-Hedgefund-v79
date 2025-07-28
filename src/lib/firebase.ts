import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Replace the values below with your actual config from Firebase Console > Project settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "AIzaSyA-7BXZuUs7kbwldRYSvDUg8Afuh29mtoI",
  authDomain: "blackwater-hedgefund.firebaseapp.com",
  projectId: "blackwater-hedgefund",
  storageBucket: "blackwater-hedgefund.appspot.com",
  messagingSenderId: "644835120177", // Find this in your Firebase config
  appId: "1:644835120177:web:afb27906803fc8bcf67110", // Find this in your Firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app; 