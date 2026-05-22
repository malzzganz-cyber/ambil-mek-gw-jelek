import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    balance: 0,
    isAdmin: false,
    createdAt: serverTimestamp()
  });

  return user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      balance: 0,
      isAdmin: false,
      createdAt: serverTimestamp()
    });
  }

  return user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserData(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

export { auth };
export type { User };
