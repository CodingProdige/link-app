// components/ProtectedRoute.js
"use client";
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/app/lib/constants';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.push(ROUTES.LOGIN.ROUTE);
    }
  }, [isClient, user, router]);

  if (!isClient || !user) {
    return <div>Loading...</div>;
  }

  return children;
}
