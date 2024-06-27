"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/dashboardAppearance.module.scss';
import { fetchUserData, updateUserTheme, uploadVideo, uploadImage } from '@/utils/firebaseUtils';
import MobilePreview from '@/components/MobilePreview';
import MobilePreviewSmall from '@/components/MobilePreviewSmall';
import { THEMES } from '@/lib/constants';
import Image from 'next/image';

export default function Appearance() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [theme, setTheme] = useState(null);
  const [userData, setUserData] = useState(null);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';
  const [isPreviewSmall, setIsPreviewSmall] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);


  const handlePreviewToggle = () => {
    setIsPreviewSmall((prevState) => !prevState);
  };

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setUserData(userData);
          setTheme(userData.theme);
          setImageUrl(userData.theme?.BACKGROUND_IMAGE?.imageUrl || '');
          setVideoUrl(userData.theme?.BACKGROUND_VIDEO?.videoUrl || '');
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
        const updatedTheme = await updateUserTheme(user.uid, selectedTheme);
        setTheme(updatedTheme);
        setImageUrl(updatedTheme.BACKGROUND_IMAGE?.imageUrl || '');
        setVideoUrl(updatedTheme.BACKGROUND_VIDEO?.videoUrl || '');
        setPreviewKey((prevKey) => prevKey + 1); // Force re-render of MobilePreview
        console.log('Theme updated:', updatedTheme);
        alert('Theme updated!');
      } catch (error) {
        console.error('Error updating user theme:', error);
      }
    }
  };

  const handleInputChange = async (e) => {
    if (!theme) {
      console.error('Theme is null');
      return;
    }

    const { name, value } = e.target;
    const updatedTheme = { ...theme };

    // Helper function to ensure the nested object exists
    const ensureNestedObject = (obj, key) => {
      if (!obj[key]) {
        obj[key] = {};
      }
    };

    switch (name) {
      case 'backgroundColor':
        ensureNestedObject(updatedTheme, 'BACKGROUND');
        updatedTheme.BACKGROUND.backgroundColor = value;
        break;
      case 'textColor':
        ensureNestedObject(updatedTheme, 'TEXT');
        updatedTheme.TEXT.color = value;
        break;
      case 'headerTextColor':
        ensureNestedObject(updatedTheme, 'HEADER_TEXT');
        updatedTheme.HEADER_TEXT.color = value;
        break;
      case 'opacityLayerBackgroundColor':
        ensureNestedObject(updatedTheme, 'OPACITY_LAYER');
        updatedTheme.OPACITY_LAYER.backgroundColor = value;
        break;
      case 'pillRadius':
        ensureNestedObject(updatedTheme, 'PILLS');
        updatedTheme.PILLS.borderRadius = `${value}px`;
        break;
      case 'backgroundMedia':
        updatedTheme.BACKGROUND_MEDIA = value;
        break;
      case 'imageBlur':
        ensureNestedObject(updatedTheme, 'BACKGROUND_IMAGE');
        updatedTheme.BACKGROUND_IMAGE.filter = value;
        break;
      case 'videoBlur':
        ensureNestedObject(updatedTheme, 'BACKGROUND_VIDEO');
        updatedTheme.BACKGROUND_VIDEO.filter = value;
        break;
      case 'gradientAngle':
        updatedTheme.GRADIENT_ANGLE = value;
        break;
      case 'gradientColorOne':
        updatedTheme.GRADIENT_ONE = value;
        break;
      case 'gradientColorTwo':
        updatedTheme.GRADIENT_TWO = value;
        break;
      case 'pillOpacity':
        ensureNestedObject(updatedTheme, 'OPACITY_LAYER');
        updatedTheme.OPACITY_LAYER.opacity = value;
        break;
      default:
        updatedTheme[name] = value; // Handle direct values
        break;
    }

    setTheme(updatedTheme);
    await updateUserTheme(user.uid, updatedTheme);
    setPreviewKey((prevKey) => prevKey + 1);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!user || !theme) {
      console.error('User or theme is undefined');
      return;
    }

    if (file) {
      try {
        setIsUploading(true);
        setImageUrl(null);
        const imageUrl = await uploadImage(user.uid, file);
        const updatedTheme = { ...theme, BACKGROUND_IMAGE: { ...theme.BACKGROUND_IMAGE, imageUrl } };
        await updateUserTheme(user.uid, updatedTheme);
        setTheme(updatedTheme);
        setImageUrl(updatedTheme.BACKGROUND_IMAGE?.imageUrl || '');
        setPreviewKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!user || !theme) {
      console.error('User or theme is undefined');
      return;
    }

    if (file) {
      try {
        setIsUploading(true);
        setVideoUrl(null);
        const videoUrl = await uploadVideo(user.uid, file);
        const updatedTheme = { ...theme, BACKGROUND_VIDEO: { ...theme.BACKGROUND_VIDEO, videoUrl } };
        await updateUserTheme(user.uid, updatedTheme);
        setTheme(updatedTheme);
        setVideoUrl(updatedTheme.BACKGROUND_VIDEO?.videoUrl || '');
        setPreviewKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error('Error uploading video:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleButtonClick = (inputRef) => {
    inputRef.current.click();
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

            {theme && (
            <div className={styles.customContainer}>
              <h4 className={styles.customTitle}>Customize</h4>
              <div className={styles.customWrapper}>
                <form className={styles.customForm}>
                  <div className={styles.contentsContainer}>
                    <div className={styles.customInputContainer}>
                      <label htmlFor="backgroundMedia">Background Type</label>
                      <select
                        name="backgroundMedia"
                        id="backgroundMedia"
                        className={styles.customSelect}
                        onChange={handleInputChange}
                        value={theme?.BACKGROUND_MEDIA || 'color'}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="color">Color</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>

                    {theme?.BACKGROUND_MEDIA === 'color' && (
                      <div className={styles.customInputContainer}>
                        <label htmlFor="backgroundColor">Background Color</label>
                        <div className={styles.inputColorContainer}>
                          <input
                            type="color"
                            id="backgroundColor"
                            name="backgroundColor"
                            value={theme?.BACKGROUND?.backgroundColor || '#ffffff'}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    )}

                    {theme?.BACKGROUND_MEDIA === 'gradient' && (
                      <div className={styles.customInputContainer}>
                        <label htmlFor="gradientColor">Background Gradient Colors</label>
                        <div className={styles.gradientColorContainer}>
                          <p>Color One</p>
                          <div className={styles.inputColorContainer}>
                            <input
                              type="color"
                              id="gradientColorOne"
                              name="gradientColorOne"
                              value={theme?.GRADIENT_ONE || '#ffffff'}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className={styles.gradientColorContainer}>
                          <p>Color Two</p>
                          <div className={styles.inputColorContainer}>
                            <input
                              type="color"
                              id="gradientColorTwo"
                              name="gradientColorTwo"
                              value={theme?.GRADIENT_TWO || '#ffffff'}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className={styles.gradientColorContainer}>
                          <p>Gradient Angle</p>
                          <div className={styles.inputNumberContainer}>
                            <input
                              type="number"
                              min="0" 
                              max="360"
                              step="10"
                              id="gradientAngle"
                              name="gradientAngle"
                              value={theme?.GRADIENT_ANGLE || '0'}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={styles.customInputContainer}>
                      <div className={styles.inputHeaderContainer}>
                        <label htmlFor="headerTextColor">Username & Bio Text Color</label>
                        <p>{theme?.HEADER_TEXT?.color || '#FFFFFF'}</p>
                      </div>
                      <div className={styles.inputColorContainer}>
                        <input
                          type="color"
                          id="headerTextColor"
                          name="headerTextColor"
                          value={theme?.HEADER_TEXT?.color || '#000000'}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className={styles.customInputContainer}>
                      <div className={styles.inputHeaderContainer}>
                        <label htmlFor="textColor">Text Color</label>
                        <p>{theme?.TEXT?.color || '#000000'}</p>
                      </div>
                      <div className={styles.inputColorContainer}>
                        <input
                          type="color"
                          id="textColor"
                          name="textColor"
                          value={theme?.TEXT?.color || '#000000'}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className={styles.customInputContainer}>
                      <div className={styles.inputHeaderContainer}>
                        <label htmlFor="opacityLayerBackgroundColor">Pill Color</label>
                        <p>{theme?.OPACITY_LAYER?.backgroundColor || '#FFFFFF'}</p>
                      </div>
                      <div className={styles.inputColorContainer}>
                        <input
                          type="color"
                          id="opacityLayerBackgroundColor"
                          name="opacityLayerBackgroundColor"
                          value={theme?.OPACITY_LAYER?.backgroundColor || '#FFFFFF'}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className={styles.customInputContainer}>
                      <div className={styles.inputHeaderContainer}>
                        <label htmlFor="pillRadius">Pill Border Radius</label>
                        <p>{theme?.PILLS?.borderRadius ? theme?.PILLS?.borderRadius : '0px'}</p>
                      </div>
                      <input
                        type="range"
                        id="pillRadius"
                        name="pillRadius"
                        min="0"
                        max="25"
                        value={theme?.PILLS?.borderRadius ? theme?.PILLS?.borderRadius.replace('px', '') : '0'}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.customInputContainer}>
                      <div className={styles.inputHeaderContainer}>
                        <label htmlFor="pillOpacity">Pill Opacity</label>
                        <p>{theme?.OPACITY_LAYER?.opacity ? theme?.OPACITY_LAYER?.opacity : '1'}</p>
                      </div>
                      <input
                        type="range"
                        id="pillOpacity"
                        name="pillOpacity"
                        min="0"
                        max="1"
                        step="0.1"
                        value={theme?.OPACITY_LAYER?.opacity ? theme?.OPACITY_LAYER?.opacity : '1'}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.mediaContainer}>
                      {theme?.BACKGROUND_MEDIA === 'video' && (
                        <h4>Video</h4>
                      )}
                      {theme?.BACKGROUND_MEDIA === 'image' && (
                        <h4>Image</h4>
                      )}
                      
                      {theme?.BACKGROUND_MEDIA === 'video' &&  (
                      <div className={styles.customInputContainerMedia}>
                        {theme?.BACKGROUND_VIDEO?.videoUrl && theme?.BACKGROUND_MEDIA === 'video' && videoUrl && (
                          <video
                            autoPlay
                            loop
                            muted
                            style={{
                              width: '20rem',
                              height: 'auto',
                              borderRadius: '25px',
                              filter: `blur(${theme?.BACKGROUND_VIDEO?.filter || '0'}px)` || '0',
                            }}
                          >
                            <source src={theme?.BACKGROUND_VIDEO?.videoUrl || '' } type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {theme?.BACKGROUND_VIDEO?.videoUrl && (
                          <div className={styles.customInputContainer}>
                            <label htmlFor="videoBlur">Video Blur</label>
                            <input
                              type="range"
                              id="videoBlur"
                              name="videoBlur"
                              min="0"
                              max="25"
                              value={theme?.BACKGROUND_VIDEO?.filter ? theme?.BACKGROUND_VIDEO.filter.replace('px', '') : '0'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                        <button 
                          className={styles.mediaUploadButtons} 
                          disabled={isUploading}
                          type="button" 
                          onClick={() => handleButtonClick(videoInputRef)}
                        >
                          {isUploading ? 'Uploading...' : theme?.BACKGROUND_VIDEO?.videoUrl ? 'Change Background Video' : 'Upload Background Video'}
                        </button>
                        <input
                          type="file"
                          id="backgroundVideo"
                          name="backgroundVideo"
                          accept="video/*"
                          ref={videoInputRef}
                          style={{ display: 'none' }}
                          onChange={handleVideoUpload}
                        />
                      </div>
                      )}
                      {theme?.BACKGROUND_MEDIA === 'image' && (
                        <div className={styles.customInputContainerMedia}>
                          {theme?.BACKGROUND_IMAGE?.imageUrl && theme?.BACKGROUND_MEDIA === 'image' && imageUrl && (
                            <Image 
                              src={theme?.BACKGROUND_IMAGE.imageUrl || ''} 
                              alt={theme?.NAME || ''} 
                              width={100}
                              height={100}
                              style={{
                                width: '20rem',
                                height: 'auto',
                                borderRadius: '25px',
                                filter: `blur(${theme?.BACKGROUND_IMAGE?.filter || '0'}px)` || '0',
                              }}
                            />
                          )}
                          {theme?.BACKGROUND_IMAGE?.imageUrl && (
                            <div className={styles.customInputContainer}>
                              <label htmlFor="imageBlur">Image Blur</label>
                              <input
                                type="range"
                                id="imageBlur"
                                name="imageBlur"
                                min="0"
                                max="25"
                                value={theme?.BACKGROUND_IMAGE?.filter ? theme?.BACKGROUND_IMAGE.filter.replace('px', '') : '0'}
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                          <button 
                            className={styles.mediaUploadButtons} 
                            disabled={isUploading}
                            type="button" 
                            onClick={() => handleButtonClick(imageInputRef)}
                          >
                            {isUploading ? 'Uploading...' : theme?.BACKGROUND_IMAGE?.imageUrl ? 'Change Background Image' : 'Upload Background Image'}
                          </button>
                          <input
                            type="file"
                            id="backgroundImage"
                            name="backgroundImage"
                            accept="image/*"
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            )}
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
