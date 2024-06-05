"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

import DraggableList from '@/components/DraggableList';
// import DashboardPricing from '@/components/DashboardPricing';
import { createCustomerPortal } from '@/components/CustomerPortal';

import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import ModalOverlay from '@/components/ModalOverlay';

const items = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();

  return (
    <div>
      {!authLoading && user && !user.username && <ModalOverlay settings={settings}/>}
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button>Sign out</button>
      <DraggableList items={items} />
      {/* <DashboardPricing currentUser={user} /> */}
      <button onClick={createCustomerPortal}>Portal session</button>
      {/* Render the dashboard content based on DASHBOARD_ROUTES */}
    </div>
  );
}
