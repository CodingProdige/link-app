"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DraggableList from '@/components/DraggableList';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import MobilePreview from '@/components/MobilePreview';
import { fetchUserData } from '@/utils/firebaseUtils';
import styles from '@/styles/dashboardLinks.module.scss';
import AddLinkForm from '@/components/AddLinkForm';

export default function Links() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [addLinkActive, setAddLinkActive] = useState(false);
  const [links, setLinks] = useState([]);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render

  useEffect(() => {
    if (!authLoading && user) {
      console.log('Authenticated user:', user.uid);
      fetchUserData(user.uid)
        .then(data => {
          setUserData(data);
          setLinks(data.links);
          console.log('Fetched user data:');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authLoading, user]);

  const toggleAddLink = () => setAddLinkActive(prevState => !prevState);

  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';

  const handleLinksUpdate = async (newLinks) => {
    setLinks(newLinks);
    setPreviewKey(prevKey => prevKey + 1); // Update key to force re-render
  };

  return (
    <>
      {
        userData && !authLoading && (
          <div className={styles.linksPage}>
          <div className={styles.linksContainer}>
            <div className={styles.addLinkContainer}>
              {
                addLinkActive ? (
                  <AddLinkForm toggleAddLink={toggleAddLink} />
                ) : (
                  <button className={styles.addLinkButton} onClick={toggleAddLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    Add Link
                  </button>
                )
              }
            </div>
            {
              links?.length > 0 && <DraggableList items={links} setItems={handleLinksUpdate} userId={user.uid} />
            }
          </div>
    
          {userData && <MobilePreview key={previewKey} linkPageUrl={linkPageUrl} />}
        </div>
        )
      }
    </>

  );
}
