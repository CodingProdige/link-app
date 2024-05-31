// auth.ts
"use client";
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';



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

export { useAuth };
