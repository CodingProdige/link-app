"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { THEMES } from '@/lib/constants';
import styles from '@/styles/themeSelector.module.scss';
import { updateUserTheme } from '@/utils/firebaseUtils';

export default function ThemeSelector({ user, setTheme }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelect = async (theme) => {
    if (user) {
      try {
        setSelectedTheme(theme);
        setTheme(theme);
        console.log('Selected theme:', theme);
      } catch (error) {
        console.error('Error selecting a theme:', error);
      }
    }
  };

  return (
    <>
      <div className={styles.themesContainer}>
        <div className={styles.themeContainerWrapper}>
          {THEMES.map((theme, index) => (
            <div
              key={index}
              className={styles.themeContainer}
              onClick={() => handleThemeSelect(theme)}
            >
                <div 
                    className={styles.themePreviewContainer}
                    style={{
                        ...(selectedTheme?.NAME === theme?.NAME && { outline: '2px solid #00a6fb', outlineOffset: '5px', borderRadius: '0.3rem' }),
                    }}
                >
                    <div 
                    className={styles.themePreview} 
                    style={{
                        ...(theme?.BACKGROUND_MEDIA === "color" &&  { backgroundColor: theme?.BACKGROUND?.backgroundColor || ""}),
                        ...(theme?.BACKGROUND_MEDIA === "gradient" && theme?.GRADIENT_ONE && theme?.GRADIENT_TWO && {
                        backgroundImage: `linear-gradient(${theme?.GRADIENT_ANGLE || 0}deg, ${theme?.GRADIENT_ONE}, ${theme?.GRADIENT_TWO})`
                        })
                    }}
                    >
                    {theme?.BACKGROUND_VIDEO?.videoUrl && (
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
                        <source src={theme?.BACKGROUND_VIDEO?.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                        </video>
                    )}
                    {theme?.BACKGROUND_IMAGE?.imageUrl && (
                        <Image
                        src={theme?.BACKGROUND_IMAGE?.imageUrl}
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
                            ...theme?.BACKGROUND_IMAGE_STYLING || {},
                        }}
                        />
                    )}
                    <ul className={styles.themePillsList}>
                        {[...Array(4)].map((_, idx) => (
                        <li key={idx} style={{ ...theme?.PILLS, position: "relative" }}>
                            <div 
                            className={styles.pillOpacityLayer}
                            style={{...theme?.OPACITY_LAYER}}
                            ></div>
                        </li>
                        ))}
                    </ul>
                    </div>
                    <p className={styles.themeName}>{theme.NAME}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
