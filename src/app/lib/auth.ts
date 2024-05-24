// auth.ts
"use client";
import { auth, db } from '@/app/lib/firebaseConfig.ts';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, DASHBOARD_ROUTES } from '@/app/lib/constants';


const register = async (email: string, password: string, additionalData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      ...additionalData,
    });
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }, { merge: true });
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

const loginWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }, { merge: true });
    return user;
  } catch (error) {
    console.error("Error logging in with Facebook:", error);
    throw error;
  }
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user: currentUser, loading, error };
};

export { register, login, logout, loginWithGoogle, loginWithFacebook, useAuth };
