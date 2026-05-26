import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` : undefined),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Robust check for Firebase config. Ensure apiKey is actually present and not a placeholder.
const isConfigValid = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 10 && 
  !firebaseConfig.apiKey.includes("MY_FIREBASE_API_KEY") &&
  !!firebaseConfig.projectId &&
  firebaseConfig.projectId.length > 3;

// Logging for debugging (will be visible in console)
if (!isConfigValid) {
  console.log("Firebase Config Status: Incomplete or missing secrets.");
}

// Initialize Firebase only once
let app = null;
if (getApps().length > 0) {
  app = getApps()[0];
} else if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

if (!isConfigValid) {
  console.warn("Firebase configuration is missing or incomplete. Authentication features will be disabled.");
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
