import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_MESUREMENT_ID,
  measurementId: "G-JCH500JJN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function getMessagingIfSupported() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    } else {
      console.warn("Firebase Messaging non supportato in questo browser.");
    }
  }
  return null;
}

export { auth, db, storage, getMessagingIfSupported };
