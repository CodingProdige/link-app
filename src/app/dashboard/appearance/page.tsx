"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/dashboardAppearance.module.scss';
import { fetchUserData, updateUserTheme  } from '@/utils/firebaseUtils';
import MobilePreview from '@/components/MobilePreview';
import MobilePreviewSmall from '@/components/MobilePreviewSmall';
import { THEMES } from '@/lib/constants';
import Image from 'next/image';

export default function Appearance() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [theme, setTheme] = useState({});
  const [userData, setUserData] = useState(null);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';
  const [isPreviewSmall, setIsPreviewSmall] = useState(false);

  const handlePreviewToggle = () => {
    setIsPreviewSmall(prevState => !prevState);
  };

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setUserData(userData);
          setTheme(userData.theme);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (!authLoading && user) {
      getUserData();
    }
  }, [authLoading, user]);


  const handleThemeSelect = async (selectedTheme) => {
    if (user) {
      try {
        const theme = await updateUserTheme(user.uid, selectedTheme);
        setPreviewKey(prevKey => prevKey + 1); // Force re-render of MobilePreview
        console.log('Theme updated:', theme);
      } catch (error) {
        console.error('Error updating user theme:', error);
      }
    }
  };

  return (
    <>
      {userData && (
        <div className={styles.appearancePage}>

          <div className={styles.appearanceContainer}>
    
            <div className={styles.themesContainer}>
              <h4 className={styles.appearanceTitle}>Themes</h4>
              <div className={styles.themeContainerWrapper}>
                {THEMES.map((theme, index) => (
                  <div 
                    key={index} 
                    className={styles.themeContainer} 
                    onClick={() => handleThemeSelect(theme)}
                  >
                    <div className={styles.themePreviewContainer}>
                      <div className={styles.themePreview} style={{ ...theme.BACKGROUND }}>
                        {theme?.BACKGROUND_VIDEO && (
                          <video
                              autoPlay
                              loop
                              muted
                              style={{
                                  position: 'absolute',
                                  top: '0',
                                  left: '0',
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                              }}
                          >
                              <source src={theme.BACKGROUND_VIDEO.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                          </video>
                        )}
                        {theme?.BACKGROUND_IMAGE && (
                          <Image 
                            src={theme?.BACKGROUND_IMAGE.imageUrl} 
                            alt={theme?.NAME} 
                            layout="fill" 
                            objectFit="cover"
                            style={{ 
                              objectPosition: 'center',
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              width: '100%',
                              height: '100%',
                              ...theme?.BACKGROUND_IMAGE_STYLING || {}
                            }}
                          />
                        )}
                        <ul className={styles.themePillsList}>
                          <li style={{...theme?.PILLS  || {} }}></li>
                          <li style={{...theme?.PILLS  || {} }}></li>
                          <li style={{...theme?.PILLS  || {} }}></li>
                          <li style={{...theme?.PILLS  || {} }}></li>
                        </ul>
                      </div>
                      <p className={styles.themeName}>{theme.NAME}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.customContainer}>
              <h4 className={styles.customTitle}>Customize</h4>
              <div className={styles.customWrapper}>

              </div>
            </div>

          </div>

          
          {linkPageUrl && userData && (
            <>
              <MobilePreview key={`${previewKey}-desktop`} linkPageUrl={linkPageUrl} />
              {isPreviewSmall && (
                <MobilePreviewSmall
                  key={`${previewKey}-small`}
                  linkPageUrl={linkPageUrl}
                  isPreviewSmall={isPreviewSmall}
                  setIsPreviewSmall={setIsPreviewSmall}
                />
              )}
            </>
          )}
          {!isPreviewSmall && (
            <div className={styles.previewButtonContainer} onClick={handlePreviewToggle}>
              <div className={styles.previewButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
                <p>Preview</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
