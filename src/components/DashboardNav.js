"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import {ROUTES, DASHBOARD_ROUTES} from '@/lib/constants';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/dashboardNav.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import Logout from '@/lib/logout';
  

async function unsetHttpOnlyCookie() {
  await fetch('/api/unset-cookie', {
    method: 'POST',
  });
}

async function handleLogout() {
  try {
    await Logout();
    // Redirect to the home page after logout
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error.message);
    // Handle error (e.g., show error message to user)
  }
}

const DashboardNav = ({settings}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          router.push('/signin');
        }
      });
  
      return () => unsubscribe();
    }, [router]);
  

  return (
    <div className={styles.dashboardNav}>
        <div className={styles.navLogoContainer}>
            <PrismicNextImage field={settings.data.logo} />
        </div>
        <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Logout
      </button>
    </div>
  )
}

export default DashboardNav