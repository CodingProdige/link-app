"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import { 
  updateOpenGraphDetails,
  updateMetaDataDetails,
  uploadImage,
  fetchUserData,
} from '@/utils/firebaseUtils'; // Adjust the import path as needed
import styles from '@/styles/dashboardSettings.module.scss';
import Loading from '@/components/Loading';

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const profileInputRef = useRef(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingMeta, setIsUpdatingMeta] = useState(false);
  const [userData, setUserData] = useState(null);

  const [openGraphTitle, setOpenGraphTitle] = useState('');
  const [openGraphDescription, setOpenGraphDescription] = useState('');
  const [openGraphImage, setOpenGraphImage] = useState('https://images.prismic.io/link-app/ZmrRoJm069VX1tdU_placeholder.webp?auto=format,compress');

  const [seoMetaTitle, setSeoMetaTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [seoTitleError, setSeoTitleError] = useState('');
  const [seoDescriptionError, setSeoDescriptionError] = useState('');

  const MAX_TITLE_LENGTH = 60;
  const MAX_DESCRIPTION_LENGTH = 150;
  const MAX_SEO_TITLE_LENGTH = 60;
  const MAX_SEO_DESCRIPTION_LENGTH = 160;

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setUserData(userData);
          setOpenGraphTitle(userData.openGraph?.title || '');
          setOpenGraphDescription(userData.openGraph?.description || '');
          setOpenGraphImage(userData.openGraph?.image || 'https://images.prismic.io/link-app/ZmrRoJm069VX1tdU_placeholder.webp?auto=format,compress');
          setSeoMetaTitle(userData.metaData?.title || '');
          setSeoMetaDescription(userData.metaData?.description || '');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (!authLoading && user) {
      getUserData();
    }
  }, [authLoading, user]);

  const handleOpenGraphSubmit = async (e) => {
    e.preventDefault();

    if (openGraphTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title exceeds ${MAX_TITLE_LENGTH} characters`);
      return;
    }

    if (openGraphDescription.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`);
      return;
    }

    const openGraphDetails = {
      title: openGraphTitle,
      description: openGraphDescription,
      image: openGraphImage,
    };

    try {
      setIsUpdating(true);
      await updateOpenGraphDetails(user.uid, openGraphDetails);
      router.refresh();
    } catch (error) {
      console.error('Error updating Open Graph details:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSeoMetaSubmit = async (e) => {
    e.preventDefault();

    if (seoMetaTitle.length > MAX_SEO_TITLE_LENGTH) {
      setSeoTitleError(`Title exceeds ${MAX_SEO_TITLE_LENGTH} characters`);
      return;
    }

    if (seoMetaDescription.length > MAX_SEO_DESCRIPTION_LENGTH) {
      setSeoDescriptionError(`Description exceeds ${MAX_SEO_DESCRIPTION_LENGTH} characters`);
      return;
    }

    const seoMeta = {
      title: seoMetaTitle,
      description: seoMetaDescription,
    };

    try {
      setIsUpdatingMeta(true);
      await updateMetaDataDetails(user.uid, seoMeta);
      router.refresh();
    } catch (error) {
      console.error('Error updating SEO meta details:', error);
    } finally {
      setIsUpdatingMeta(false);
    }
  };

  const handleOphenGraphImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!user) {
      console.error('User is undefined');
      return;
    }

    if (file) {
      try {
        setIsImageUploading(true);
        const imageUrl = await uploadImage(user.uid, file);
        setOpenGraphImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleButtonClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleTitleChange = (e) => {
    setOpenGraphTitle(e.target.value);
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      setTitleError('');
    } else {
      setTitleError(`Title exceeds ${MAX_TITLE_LENGTH} characters`);
    }
  };

  const handleDescriptionChange = (e) => {
    setOpenGraphDescription(e.target.value);
    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescriptionError('');
    } else {
      setDescriptionError(`Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`);
    }
  };

  const handleSeoTitleChange = (e) => {
    setSeoMetaTitle(e.target.value);
    if (e.target.value.length <= MAX_SEO_TITLE_LENGTH) {
      setSeoTitleError('');
    } else {
      setSeoTitleError(`Title exceeds ${MAX_SEO_TITLE_LENGTH} characters`);
    }
  };

  const handleSeoDescriptionChange = (e) => {
    setSeoMetaDescription(e.target.value);
    if (e.target.value.length <= MAX_SEO_DESCRIPTION_LENGTH) {
      setSeoDescriptionError('');
    } else {
      setSeoDescriptionError(`Description exceeds ${MAX_SEO_DESCRIPTION_LENGTH} characters`);
    }
  };

  if (authLoading || prismicLoading) return <Loading />;

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsSection}>
        <form onSubmit={handleOpenGraphSubmit} className={styles.form}>
          <h4>Open Graph Page Settings</h4>
          <div className={styles.opengraphSections}>
            <div className={styles.opengraphPreview}>
              <div className={styles.openGraphImage} style={{backgroundImage: `url("${openGraphImage}")` }}>
              </div>
              <div className={styles.openGraphDetails}>
                <h5>{openGraphTitle || 'Open Graph Title'}</h5>
                <p>{openGraphDescription || 'Open Graph Description'}</p>
              </div>
            </div>

            <div className={styles.opengraphEdit}>
              <h4>Edit Open Graph Details</h4>
              <div className={styles.formGroups}>
                <div className={styles.formGroup}>
                  <label htmlFor="openGraphTitle">Open Graph Title</label>
                  <input
                    type="text"
                    id="openGraphTitle"
                    value={openGraphTitle}
                    required
                    onChange={handleTitleChange}
                    maxLength={MAX_TITLE_LENGTH}
                  />
                  {titleError && <p className={styles.errorText}>{titleError}</p>}
                  <p>{openGraphTitle.length}/{MAX_TITLE_LENGTH} characters</p>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="openGraphDescription">Open Graph Description</label>
                  <textarea
                    id="openGraphDescription"
                    value={openGraphDescription}
                    required
                    onChange={handleDescriptionChange}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  ></textarea>
                  {descriptionError && <p className={styles.errorText}>{descriptionError}</p>}
                  <p>{openGraphDescription.length}/{MAX_DESCRIPTION_LENGTH} characters</p>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="openGraphImage">Open Graph Image URL</label>
                  <button 
                    className={styles.mediaUploadButtons} 
                    disabled={isImageUploading}
                    type="button" 
                    onClick={() => handleButtonClick(profileInputRef)}
                  >
                    {isImageUploading ? 'Uploading...' : 'Upload OG Image'}
                  </button>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    ref={profileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleOphenGraphImageUpload}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className={styles.submitButton} type="submit">
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className={styles.settingsSection}>
        <form onSubmit={handleSeoMetaSubmit} className={styles.form}>
          <h4>SEO Meta Settings</h4>
          <div className={styles.formGroups}>
            <div className={styles.formGroup}>
              <label htmlFor="seoMetaTitle">SEO Meta Title</label>
              <input
                type="text"
                id="seoMetaTitle"
                value={seoMetaTitle}
                required
                onChange={handleSeoTitleChange}
                maxLength={MAX_SEO_TITLE_LENGTH}
              />
              {seoTitleError && <p className={styles.errorText}>{seoTitleError}</p>}
              <p>{seoMetaTitle.length}/{MAX_SEO_TITLE_LENGTH} characters</p>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="seoMetaDescription">SEO Meta Description</label>
              <textarea
                id="seoMetaDescription"
                value={seoMetaDescription}
                required
                onChange={handleSeoDescriptionChange}
                maxLength={MAX_SEO_DESCRIPTION_LENGTH}
              ></textarea>
              {seoDescriptionError && <p className={styles.errorText}>{seoDescriptionError}</p>}
              <p>{seoMetaDescription.length}/{MAX_SEO_DESCRIPTION_LENGTH} characters</p>
            </div>
          </div>
          <button className={styles.submitButton} type="submit">
            {isUpdatingMeta ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
