"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';


export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}
