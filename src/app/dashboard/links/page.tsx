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

  const linkPageUrl = userData ? `${window.location.origin}/user/${userData.username}` : '';

  return (
    <div className={styles.linksPage}>
      <DraggableList items={items} />
      {userData && <MobilePreview linkPageUrl={linkPageUrl} />}
    </div>
  );
}
