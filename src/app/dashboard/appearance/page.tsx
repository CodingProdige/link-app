"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/dashboardAppearance.module.scss';
import { fetchUserData, getAllTemplates  } from '@/utils/firebaseUtils';
import MobilePreview from '@/components/MobilePreview';



export default function Appearance() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [theme, setTheme] = useState({});
  const [userData, setUserData] = useState(null);
  const [themeTemplates, setThemeTemplates] = useState([]);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';

  let CURRENT_THEME = {

  }

  useEffect(() => {
    try {
      const getUserData = async () => {
        const userData = await fetchUserData(user.uid);
        setUserData(userData);
        setTheme(userData.theme);
      };

      const getThemeTemplates = async () => {
        const templates = await getAllTemplates();
        setThemeTemplates(templates);
      }

      if (!authLoading && user) {
        try {
          getUserData();
        } catch (error) {
          console.error('Error fetching user data:', error);
        };

        try {
          getThemeTemplates();
        } catch (error) {
          console.error('Error fetching theme templates:', error);
        };
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [authLoading, user]);

  return (
    <div className={styles.appearancePage}>
      <div className={styles.appearanceSettings}>
        <div className={styles.formContainer}></div>
        <div className={styles.themeTemplatesContainer}></div>
      </div>
      {userData && <MobilePreview key={previewKey} linkPageUrl={linkPageUrl} />}

    </div>
  );
}