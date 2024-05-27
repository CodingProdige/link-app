"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/lib/constants';


import DraggableList from '@/components/DraggableList';
// import DashboardPricing from '@/components/DashboardPricing';
import { createCustomerPortal } from '@/components/CustomerPortal';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const items = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();


  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.HOME.ROUTE);
    } catch (error: any) {
      console.error(error.message);
    }
  }



  return (
    <ProtectedRoute>
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={handleLogout}>Sign out</button>
      <DraggableList items={items} />
      {/* <DashboardPricing currentUser={user} /> */}
      <button onClick={createCustomerPortal}>Portal session</button>
      {/* Render the dashboard content based on DASHBOARD_ROUTES */}
    </div>
    </ProtectedRoute>
  );
}
