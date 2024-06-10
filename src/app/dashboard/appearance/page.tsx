"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/dashboardAppearance.module.scss';
import { fetchUserData, getAllTemplates  } from '@/utils/firebaseUtils';
import MobilePreview from '@/components/MobilePreview';
import MobilePreviewSmall from '@/components/MobilePreviewSmall';


export default function Appearance() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [theme, setTheme] = useState({});
  const [userData, setUserData] = useState(null);
  const [themeTemplates, setThemeTemplates] = useState([]);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';
  const [isPreviewSmall, setIsPreviewSmall] = useState(false);

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

  const handlePreviewToggle = () => {
    setIsPreviewSmall(prevState => !prevState);
  };

  return (
    <div className={styles.appearancePage}>
      <div className={styles.appearanceSettings}>
        <div className={styles.formContainer}></div>
        <div className={styles.themeTemplatesContainer}></div>
      </div>
      {linkPageUrl && userData && (
        <>
          <MobilePreview key={`${previewKey}-desktop`} linkPageUrl={linkPageUrl} />
          {
            isPreviewSmall && (
              <MobilePreviewSmall
                key={`${previewKey}-small`}
                linkPageUrl={linkPageUrl}
                isPreviewSmall={isPreviewSmall}
                setIsPreviewSmall={setIsPreviewSmall}
              />
            )
          }
        </>
      )}
      {
        !isPreviewSmall && (
          <div className={styles.previewButtonContainer} onClick={handlePreviewToggle}>
            <div className={styles.previewButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
              </svg>
              <p>Preview</p>
            </div>
          </div>
        )
      }

    </div>
  );
}