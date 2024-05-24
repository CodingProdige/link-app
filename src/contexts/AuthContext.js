// contexts/AuthContext.js
"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, facebookProvider } from '@/app/lib/firebaseConfig.ts';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/lib/constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithFacebook = () => {
    return signInWithPopup(auth, facebookProvider);
  };

  const logout = () => {
    signOut(auth);
    router.push(ROUTES.HOME.ROUTE);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loginWithGoogle, loginWithFacebook, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
