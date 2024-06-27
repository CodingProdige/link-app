"use client";

import React, { useEffect, useState } from 'react';
import styles from '@/styles/dashboardLayout.module.scss';
import ModalOverlay from '@/components/ModalOverlay';
import DashboardNav from '@/components/DashboardNav';
import { AuthProvider, useAuth } from '@/firebase/auth';
import { PrismicProvider, usePrismic } from '@/context/PrismicContext';
import Loading from '@/components/Loading';
import { fetchUserData } from '@/utils/firebaseUtils';

const LayoutComponent = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { settings, navigation, page, loading: prismicLoading } = usePrismic();
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null); // Add username state

  useEffect(() => {
    if (user && user.uid) {
      fetchUserData(user.uid).then((data) => {
        setUserData(data);
        setUsername(data.username); // Initialize username state
      });
    }
  }, [user]);

  const handleUsernameUpdate = (newUsername) => {
    setUsername(newUsername); // Function to update username state
  };

  if (prismicLoading || authLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.dashboard}>
      {!username && (
        <ModalOverlay settings={settings} onUsernameUpdate={handleUsernameUpdate} />
      )}
      {
        username && ( // Conditionally render based on username state
          <>
            <div className={styles.navContainer}>
              <DashboardNav settings={settings} />
            </div>
            <div className={styles.dashboardContent}>
              {children}
            </div>
          </>
        )
      }
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <PrismicProvider>
        <LayoutComponent>{children}</LayoutComponent>
      </PrismicProvider>
    </AuthProvider>
  );
};

export default Layout;
