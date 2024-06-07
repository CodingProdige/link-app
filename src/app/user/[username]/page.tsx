"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '@/styles/userlinkPage.module.scss';
import Loading from '@/components/Loading';
import Link from 'next/link';

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = ({ params: { username } }: UserPageProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/get-user-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (!data) {
          notFound();
        }

        setUserData(data.user);
      } catch (err) {
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <Loading/>;

  return (
    <div className={styles.containerPublicProfile}>
      <div className={styles.background}></div>
      <div className={styles.innerContainer}>
        <div className={styles.profileContainer}>
          {
            userData.photoUrl && (
              <Image 
                src={userData.photoUrl} 
                alt={userData.username} 
                width={150} 
                height={150} 
              />
            )
          }
          <p className={styles.username}>@{userData.username}</p>
        </div>
        {
          userData.links && (
            <div className={styles.linksContainer}>
              <ul>
                {userData.links.map((link: any) => (
                  <Link href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
                    <li key={link.id}>
                      {link.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default UserPage;
