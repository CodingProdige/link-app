"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/dashboardAppearance.module.scss';
import { 
  fetchUserData, updateUserTheme, uploadVideo, uploadImage, 
  updateUserBio, updateUserTitle, updateUserPhotoUrl, 
  deleteUserPhotoUrl, updateUserShowLogo, checkSubscriptionStatus
} from '@/utils/firebaseUtils';
import MobilePreview from '@/components/MobilePreview';
import MobilePreviewSmall from '@/components/MobilePreviewSmall';
import { THEMES } from '@/lib/constants';
import Image from 'next/image';
import { PrismicNextImage } from "@prismicio/next";
import { is } from 'cheerio/lib/api/traversing';

export default function Appearance() {
  const { user, loading: authLoading } = useAuth();
  const { settings } = usePrismic();
  const router = useRouter();

  const [theme, setTheme] = useState(null);
  const [userData, setUserData] = useState(null);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const [isPreviewSmall, setIsPreviewSmall] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [removingProfileImage, setRemovingProfileImage] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [bioCharCount, setBioCharCount] = useState(120);
  const [titleCharCount, setTitleCharCount] = useState(30);
  const [showLogo, setShowLogo] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';

  const handleBioChange = (event) => {
    const newBio = event.target.value;
    if (newBio.length <= 120) {
      setBio(newBio);
      setBioCharCount(120 - newBio.length);
      updateUserBio(user.uid, newBio);
    }
  };

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    if (newTitle.length <= 30) {
      setTitle(newTitle);
      setTitleCharCount(30 - newTitle.length);
      updateUserTitle(user.uid, newTitle);
    }
  };

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
          setBio(userData.bio || '');
          setTitle(userData.title || '');
          setBioCharCount(120 - (userData.bio?.length || 0));
          setTitleCharCount(30 - (userData.title?.length || 0));
          setShowLogo(userData.showLogo || false); // Set showLogo from userData

          const isSubscribed = userData.premium || await checkSubscriptionStatus(user.uid);
          setIsSubscribed(isSubscribed);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (!authLoading && user) {
      getUserData();
    }
  }, [authLoading, user, isProfileUploading, removingProfileImage]);

  const handleThemeSelect = async (selectedTheme) => {
    if (user) {
      try {
        const updatedTheme = await updateUserTheme(user.uid, selectedTheme);
        setTheme(updatedTheme);
        setImageUrl(updatedTheme.BACKGROUND_IMAGE?.imageUrl || '');
        setVideoUrl(updatedTheme.BACKGROUND_VIDEO?.videoUrl || '');
        setPreviewKey((prevKey) => prevKey + 1); // Force re-render of MobilePreview
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

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!user || !theme) {
      console.error('User or theme is undefined');
      return;
    }

    if (file) {
      try {
        setIsProfileUploading(true);
        const imageUrl = await uploadImage(user.uid, file);
        await updateUserPhotoUrl(user.uid, imageUrl);
        setPreviewKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsProfileUploading(false);
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

  const handleRemoveProfileImage = async () => {
    try {
      setRemovingProfileImage(true);
      await deleteUserPhotoUrl(user.uid);
      setPreviewKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error removing profile image:', error);
    } finally {
      setRemovingProfileImage(false);
    }
  };

  const handleButtonClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleShowLogoChange = async (e) => {
    const newShowLogo = e.target.checked;
    setShowLogo(newShowLogo);

    try {
      const updatedData = await updateUserShowLogo(user.uid, newShowLogo);
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating show logo:', error);
    }
  };

  const initial = userData?.username?.toUpperCase();

  return (
    <>
      {userData && (
        <div className={styles.appearancePage}>
          <div className={styles.appearanceContainer}>
            <div className={styles.profileContainer}>
              <h4 className={styles.profileTitle}>Profile</h4>
              <div className={styles.profileWrapper}>
                <div className={styles.profileInfoContainer}>
                  <div 
                    className={styles.profileImageContainer}
                    style={userData?.photoUrl ? { backgroundImage: `url(${userData?.photoUrl})` } : { backgroundColor: '#000000' }}
                  >
                    {!userData?.photoUrl && (
                      <h2>{initial.split('')[0]}</h2>
                    )}
                  </div>
                  <div className={styles.profileImageButtons}>
                    <button 
                      className={styles.mediaUploadButtons} 
                      disabled={isProfileUploading}
                      type="button" 
                      onClick={() => handleButtonClick(profileInputRef)}
                    >
                      {isProfileUploading ? 'Uploading...' : userData?.photoUrl ? 'Change Profile Image' : 'Upload Profile Image'}
                    </button>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      ref={profileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleProfileImageUpload}
                    />
                    <button 
                      className={styles.uploadButton}
                      onClick={handleRemoveProfileImage}
                      disabled={removingProfileImage}
                    >
                      {removingProfileImage ? 'Removing...' : 'Remove Profile Image'}
                    </button>
                  </div>
                </div>
                <div className={styles.profileFormContainer}>
                  <form className={styles.profileForm}>
                    <div className={styles.profileFormInputContainer}>
                      <label htmlFor="title">Profile Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                      />
                      <span>{titleCharCount} characters left</span>
                    </div>
                    <div className={styles.profileFormInputContainer}>
                      <label htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={handleBioChange}
                      />
                      <span>{bioCharCount} characters left</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>

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
                        <h4>
                          Video 
                          {isSubscribed === false && (
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                              </svg>
                            </span>
                          )}
                        </h4>
                      )}
                      {theme?.BACKGROUND_MEDIA === 'image' && (
                        <h4>
                          Image
                          {isSubscribed === false && (
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                              </svg>
                            </span>
                          )}  
                        </h4>
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
                              disabled={isSubscribed === false}
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
                          disabled={isUploading || isSubscribed === false}
                          type="button" 
                          onClick={() => handleButtonClick(videoInputRef)}
                          style={isSubscribed === false ? { cursor: 'not-allowed' } : {}}
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
                                disabled={isSubscribed === false}
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
                            disabled={isUploading || isSubscribed === false}
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

            <div className={styles.showLogoContainer}>
              <h4 className={styles.showLogoTitle}>Show Logo</h4>
              <div className={styles.showLogoWrapper}>
                <div className={styles.showLogoPreviewContainer}>

                  <div className={styles.navLogoContainer}>
                    <PrismicNextImage field={settings.data.logo} />
                  </div>
                  <div className={styles.switchContainer}>
                    <div className={styles.toggleContainer}>
                      <label className={styles.switch}>
                        <input
                          disabled={isSubscribed === false}
                          type="checkbox"
                          checked={showLogo}
                          onChange={handleShowLogoChange}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    {isSubscribed === false && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                    )}
                  </div>
                </div>
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
