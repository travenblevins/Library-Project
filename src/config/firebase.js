import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Add these

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// Centralized auth methods
const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
const signupWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Store user in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email: userCredential.user.email,
    createdAt: new Date()
  });
  return userCredential;
};
const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  // Store user in Firestore (if new)
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    createdAt: new Date()
  }, { merge: true });
  return userCredential;
};

// Allow callers to await logout completion
const logout = () => signOut(auth);

export {
  app,
  auth,
  db, // Export Firestore
  googleProvider,
  logout,
  loginWithEmail,
  signupWithEmail,
  loginWithGoogle
};
