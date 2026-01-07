import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNCZTvyB7zOjgLfgSdakYRWg4SC2YY0Z4",
  authDomain: "test-30587.firebaseapp.com",
  projectId: "test-30587",
  storageBucket: "test-30587.firebasestorage.app",
  messagingSenderId: "485158061750",
  appId: "1:485158061750:web:a859abe3c3e638e29e4817",
  measurementId: "G-MQ9XJ1GSBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);