import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Get these values from Firebase Console -> Project Settings -> General ->
// "Your apps" -> Web app -> SDK setup and configuration.
// Set them in frontend/.env (see .env.example).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Whether Firebase is actually configured. If not, we avoid initializing
// it at all so the app never crashes - the Login page shows Google sign-in
// as unavailable instead (see Login.jsx).
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let auth = null;
const googleProvider = new GoogleAuthProvider();

// Forces Google to always show the "Choose an account" picker listing
// every Google account currently signed in on this browser/device, rather
// than silently reusing whichever account was used last time, or jumping
// straight to a plain email entry box. This lets the person pick exactly
// which of their accounts they want to sign in with, every time.
googleProvider.setCustomParameters({ prompt: "select_account" });

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth, googleProvider };