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
import Loading from '@/components/Loading';

export default function Links() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [addLinkActive, setAddLinkActive] = useState(false);
  const [links, setLinks] = useState([]);
  const [previewKey, setPreviewKey] = useState(0); // Key to force MobilePreview re-render
  const [linkPageUrl, setLinkPageUrl] = useState('/');

  const toggleAddLink = () => setAddLinkActive(prevState => !prevState);

  const handleLinksUpdate = async (newLinks) => {
    setLinks(newLinks);
    setPreviewKey(prevKey => prevKey + 1); // Update key to force re-render
  };

  const getOrigin = () => {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    return 'https://fansl.ink'; // Replace with a suitable fallback
  };
  
  useEffect(() => {
    if (!authLoading && user) {
      console.log('Authenticated user:', user.uid);
      fetchUserData(user.uid)
        .then(data => {
          if (data) {
            setUserData(data);
            setLinks(data.links || []);
            console.log('Fetched user data:', data);
            const origin = getOrigin();
            console.log('window.location.origin:', origin);
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

  if (!userData) {
    return <div>Error: No user data found.</div>;
  }

  return (
    <>
      <div className={styles.linksPage}>
        <div className={styles.linksContainer}>
          <div className={styles.addLinkContainer}>
            {addLinkActive ? (
              <AddLinkForm toggleAddLink={toggleAddLink} />
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
          <MobilePreview key={previewKey} linkPageUrl={linkPageUrl} />
        )}
      </div>
    </>
  );
}
