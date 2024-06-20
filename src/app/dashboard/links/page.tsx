"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DraggableList from '@/components/DraggableList';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import MobilePreview from '@/components/MobilePreview';
import MobilePreviewSmall from '@/components/MobilePreviewSmall';
import { fetchUserData } from '@/utils/firebaseUtils';
import styles from '@/styles/dashboardLinks.module.scss';
import AddLinkForm from '@/components/AddLinkForm';
import Loading from '@/components/Loading';
import { prev } from 'cheerio/lib/api/traversing';

const Links = () => {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [addLinkActive, setAddLinkActive] = useState(false);
  const [links, setLinks] = useState([]);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const [linkPageUrl, setLinkPageUrl] = useState('/');
  const [isPreviewSmall, setIsPreviewSmall] = useState(false);

  const toggleAddLink = () => setAddLinkActive(prevState => !prevState);

  const handleLinksUpdate = async (newLinks) => {
    setLinks(newLinks);
    setPreviewKey(prevKey => prevKey + 1); // Update key to force re-render of MobilePreview
  };

  const handleAddLinkActive = () => {
    setAddLinkActive(prevState => !prevState);
  }

  const getOrigin = () => {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    return 'https://fansl.ink'; // Replace with a suitable fallback
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserData(user.uid)
        .then(data => {
          if (data) {
            setUserData(data);
            setLinks(data.links || []);
            const origin = getOrigin();
            setLinkPageUrl(`${origin}/user/${data.username}`); // Update link page URL
          } else {
            console.error('No user data found');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authLoading, user]);

  if (authLoading || prismicLoading) {
    return <Loading />;
  }

  const handlePreviewToggle = () => {
    setIsPreviewSmall(prevState => !prevState);
  };

  return (
    <div className={styles.linksPage}>
      <div className={styles.linksContainer}>
        <div className={styles.addLinkContainer}>
          {addLinkActive ? (
            <AddLinkForm toggleAddLink={toggleAddLink} setItems={handleLinksUpdate} userId={user.uid} setAddLinkActive={handleAddLinkActive} />
          ) : (
            <button className={styles.addLinkButton} onClick={toggleAddLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              Add Link
            </button>
          )}
        </div>
        {links.length > 0 && <DraggableList items={links} setItems={handleLinksUpdate} userId={user.uid} />}
      </div>
      {linkPageUrl && (
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
};

export default Links;
