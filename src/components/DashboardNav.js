"use client";
import React from 'react';
import {ROUTES, DASHBOARD_ROUTES} from '@/app/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/dashboardNav.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
  


const DashboardNav = ({settings}) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
  
  
    const handleLogout = async () => {
      try {
        await logout();
        router.push(ROUTES.HOME.ROUTE);
      } catch (error) {
        console.error(error.message);
      }
    }

  return (
    <div className={styles.dashboardNav}>
        <div className={styles.navLogoContainer}>
            <PrismicNextImage field={settings.data.logo} />
        </div>
    </div>
  )
}

export default DashboardNav