"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import {ROUTES, DASHBOARD_ROUTES} from '@/lib/constants';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/dashboardNav.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { useAuth } from '@/firebase/auth';
import Logout from '@/lib/logout';
import Image from 'next/image';
import {IMAGES} from '@/lib/images';

function getRandomHumanImage() {
  const humanImages = Object.values(IMAGES.PROFILE.HUMANS);
  const randomIndex = Math.floor(Math.random() * humanImages.length);
  return humanImages[randomIndex];
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
    const { user: authUser } = useAuth();
  

  return (
    <div className={styles.dashboardNav}>
      <div className={styles.navLogoContainer}>
          <PrismicNextImage field={settings.data.logo} />
      </div>
      <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Logout
      </button>
      <div>
      {authUser && (
          <div className={styles.profileImageContainer}>
            <Image src={authUser.photoURL || getRandomHumanImage()} alt={authUser.displayName} width={40} height={40} />
          </div>
        )}
      </div> 
    </div>
  )
}

export default DashboardNav