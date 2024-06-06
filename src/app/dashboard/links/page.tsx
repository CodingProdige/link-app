"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DraggableList from '@/components/DraggableList';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import MobilePreview from '@/components/MobilePreview';
import { fetchUserData } from '@/utils/firebaseUtils';
import styles from '@/styles/dashboardLinks.module.scss';

const items = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

export default function Links() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [addLinkActive, setAddLinkActive] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      console.log('Authenticated user:', user.uid);
      fetchUserData(user.uid)
        .then(data => {
          setUserData(data);
          console.log('Fetched user data:');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authLoading, user]);

  const toggleAddLink = () => setAddLinkActive(prevState => !prevState);


  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';

  return (
    <div className={styles.linksPage}>
      <div className={styles.linksContainer}>
        <div className={styles.addLinkContainer}>
          {
            addLinkActive ? (
              <form className={styles.addLinkForm}>
                <input type="text" placeholder="Link Name" />
                <input type="text" placeholder="Link URL" />
                <button type="submit">Save</button>
                <button onClick={toggleAddLink}>Cancel</button>
              </form>
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
          userData?.links && <DraggableList items={items} />
        }
      </div>

      {userData && <MobilePreview linkPageUrl={linkPageUrl} />}
    </div>
  );
}
