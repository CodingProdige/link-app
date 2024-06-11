"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { fetchUserDataByUsername } from '@/utils/firebaseUtils';
import { usePrismic } from '@/context/PrismicContext';
import { PrismicNextImage } from '@prismicio/next';
import { THEMES } from '@/lib/themes';

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
  const [theme, setTheme] = useState(THEMES.default);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUserDataByUsername(username);

        if (!data) {
          notFound();
          return;
        }

        setUserData(data);

        if (data.theme) {
          setTheme(data.theme);
        }
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
    return <div style={theme.error}>{error}</div>;
  }

  if (!userData) {
    return <div style={theme.error}>User data not found.</div>;
  }

  return (
    <div style={theme.containerPublicProfile}>
      <div style={theme.background}></div>
      <div style={theme.innerContainer}>
        <div style={theme.profileContainer}>
          {userData?.photoUrl && (
            <Image 
              src={userData.photoUrl} 
              alt={userData.username} 
              width={150} 
              height={150} 
              style={theme.profileImage}
            />
          )}
          <div style={theme.nameContainer}>
            <p style={theme.username}>@{userData.username}</p>
            {userData?.name && <p style={theme.name}>{userData.name}</p>}
          </div>
        </div>
        {userData?.links && (
          <div style={theme.linksContainer}>
            <ul style={theme.linksList}>
              {userData?.links.map((link: any) => (
                <Link style={theme.linkPill} href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
                  <li style={theme.linkItem} key={link.id}>
                    <p style={theme.linkTitle}>{link.title}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
      {userData?.fanslinkLogo && userData?.fanslinkLogo !== false && (
        <div style={theme.fanslinkLogo}>
          <PrismicNextImage field={settings.data.logo} style={theme.fanslinkLogoImage} />
        </div>
      )}
    </div>
  );
};

export default UserPage;
