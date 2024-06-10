"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '@/styles/userlinkPage.module.scss';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { fetchUserDataByUsername } from '@/utils/firebaseUtils';
import { usePrismic } from '@/context/PrismicContext';
import { PrismicNextImage } from '@prismicio/next';

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = ({ params: { username } }: UserPageProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings, loading: prismicLoading } = usePrismic();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUserDataByUsername(username);

        if (!data) {
          notFound();
          return;
        }

        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading || prismicLoading) return <Loading />;

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userData) {
    return <div className={styles.error}>User data not found.</div>;
  }

  return (
    <div className={styles.containerPublicProfile}>
      <div className={styles.background}></div>
      <div className={styles.innerContainer}>
        <div className={styles.profileContainer}>
          {userData?.photoUrl && (
            <Image 
              src={userData.photoUrl} 
              alt={userData.username} 
              width={150} 
              height={150} 
            />
          )}
          <div className={styles.nameContainer}>
            <p className={styles.username}>@{userData.username}</p>
            {
              userData?.name && (
                <p className={styles.name}>{userData.name}</p>
              )
            }
          </div>
        </div>
        {userData?.links && (
          <div className={styles.linksContainer}>
            <ul>
              {userData?.links.map((link: any) => (
                <Link href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
                  <li key={link.id}>
                    {link.title}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
      {
        userData?.fanslinkLogo && userData?.fanslinkLogo !== false && (
          <div className={styles.fanslinkLogo}>
            <PrismicNextImage field={settings.data.logo} />
          </div>
        )
      }
    </div>
  );
};

export default UserPage;
