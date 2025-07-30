import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // These would be replaced with actual Firebase config
  apiKey: "AIzaSyBI3GYWgNZhSpRAOlIyJDxiZQ1tZ79F9bg",
  authDomain: "zerowaste-dinemap.firebaseapp.com",
  projectId: "zerowaste-dinemap",
  storageBucket: "zerowaste-dinemap.firebasestorage.app",
  messagingSenderId: "768289040435",
  appId: "1:768289040435:web:710f917125192464839b46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;