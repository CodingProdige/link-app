"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { fetchUserDataByUsername } from '@/utils/firebaseUtils';
import { usePrismic } from '@/context/PrismicContext';
import { PrismicNextImage } from '@prismicio/next';
import styles from '@/styles/userlinkPage.module.scss';
import * as FaIcons from 'react-icons/fa'; // Import all FontAwesome icons
import { IconContext } from 'react-icons';
import EmbedComponent from '@/components/EmbedUrl';

interface UserPageProps {
  params: {
    username: string;
  };
}

const LinkComponent = ({ link }) => {
  if (link?.layout === "classic" && link?.linkType === "external") {
    return (
      <Link className={styles.linkPill} href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
        <li className={styles.linkItem} key={link.id}>
          {link?.metadata?.metadata["og:icon"] ? (
            <div className={styles.selectedIcon}>
              <IconContext.Provider value={{ size: '32px' }}>
                {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
              </IconContext.Provider>
            </div>
          ) : (
            <div className={styles.imageIconWrapper}>
              {link?.metadata?.metadata["og:image"] ? (
                <div className={styles.linkImageContainer} style={{backgroundImage: `url("${link.metadata.metadata["og:image"]}")`}}></div>
              ) : (
                <div className={styles.emptyThumbnail}></div>
              )}
            </div>
          )}
          <p className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
          <div className={styles.linkOptions}>
            {/* Optional link options */}
          </div>
        </li>
      </Link>
    )
  }

  if (link?.layout === "featured" && link?.linkType === "external") {
    return (
      <Link 
        className={styles.linkPillFeatured} 
        href={link.link} 
        key={link.id} 
        target="_blank" 
        rel="noopener noreferrer"
        style={link?.metadata?.metadata["og:image"] ? {backgroundImage: `url("${link?.metadata?.metadata["og:image"]}")`} : {}}
      >
        <li className={styles.linkItem} key={link.id}>
          <div className={styles.selectedIcon}>
            {link?.metadata?.metadata["og:icon"] && (
              <IconContext.Provider value={{ size: '32px' }}>
                {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
              </IconContext.Provider>
            )}
          </div>
          <div className={styles.linkContent}>
            <p className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
            <div className={styles.linkOptions}>
              {/* Optional link options */}
            </div>
          </div>
        </li>
      </Link>
    )
  }

  if (link?.linkType === "embed") {
    if (link?.metadata?.mediaType.includes("video")) {
      return (
        <div className={styles.linkPillVideo} key={link.id}>
          <li className={styles.linkItem} key={link.id}>
            <div className={styles.selectedIcon}>
              {link?.metadata?.metadata["og:icon"] ? (
                <div className={styles.selectedIcon}>
                  <IconContext.Provider value={{ size: '32px' }}>
                    {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
                  </IconContext.Provider>
                </div>
              ) : (
                <div className={styles.imageIconWrapper}>
                  {link?.metadata?.metadata["og:image"] ? (
                    <div className={styles.linkImageContainer} style={{backgroundImage: `url("${link.metadata.metadata["og:image"]}")`}}></div>
                  ) : (
                    <div className={styles.emptyThumbnail}></div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.linkContent}>
              <p className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
              <div className={styles.linkOptions}>
                {/* Optional link options */}
              </div>
            </div>
          </li>
          <EmbedComponent url={`${link?.link}`} />
        </div>
      );
    } else if (link?.metadata?.mediaType.includes("music")) {
      return (
        <div className={styles.linkPillMusic} key={link.id}>
          <li className={styles.linkItem} key={link.id}>
            <div className={styles.selectedIcon}>
              {link?.metadata?.metadata["og:icon"] ? (
                <div className={styles.selectedIcon}>
                  <IconContext.Provider value={{ size: '32px' }}>
                    {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
                  </IconContext.Provider>
                </div>
              ) : (
                <div className={styles.imageIconWrapper}>
                  {link?.metadata?.metadata["og:image"] ? (
                    <div className={styles.linkImageContainer} style={{backgroundImage: `url("${link.metadata.metadata["og:image"]}")`}}></div>
                  ) : (
                    <div className={styles.emptyThumbnail}></div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.linkContent}>
              <p className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
              <div className={styles.linkOptions}>
                {/* Optional link options */}
              </div>
            </div>
          </li>
          <EmbedComponent url={`${link?.link}`} />
        </div>
      );
    }
  }

  if (link?.linkType === "external") {
    return (
      <Link className={styles.linkPill} href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
        <li className={styles.linkItem} key={link.id}>
          {link?.metadata?.metadata["og:icon"] ? (
            <div className={styles.selectedIcon}>
              <IconContext.Provider value={{ size: '32px' }}>
                {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
              </IconContext.Provider>
            </div>
          ) : (
            <div className={styles.imageIconWrapper}>
              {link?.metadata?.metadata["og:image"] ? (
                <div className={styles.linkImageContainer} style={{backgroundImage: `url("${link.metadata.metadata["og:image"]}")`}}></div>
              ) : (
                <div className={styles.emptyThumbnail}></div>
              )}
            </div>
          )}
          <p className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
          <div className={styles.linkOptions}>
            {/* Optional link options */}
          </div>
        </li>
      </Link>
    );
  }

  return null; // Return null for unsupported layouts or link types
};

const UserPage = ({ params: { username } }: UserPageProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings, loading: prismicLoading } = usePrismic();
  const [theme, setTheme] = useState(null);

  const handleShareLink = async ({ url }: { url: string }) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy the link: ', err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching data for username: ${username}`);
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
              className={styles.profileImage}
            />
          )}
          <div className={styles.nameContainer}>
            <p className={styles.username}>@{userData.username}</p>
            {userData?.name && <p className={styles.name}>{userData.name}</p>}
          </div>
        </div>
        {userData?.links && (
          <div className={styles.linksContainer}>
            <ul className={styles.linksList}>
              {userData?.links.map((link: any) => (
                <div className={styles.linkWrapper} key={link.id}>
                  {link?.active && (
                    <LinkComponent link={link} />
                  )}
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
      {userData?.fanslinkLogo && userData?.fanslinkLogo !== false && (
        <div className={styles.fanslinkLogo}>
          <PrismicNextImage field={settings.data.logo} className={styles.fanslinkLogoImage} />
        </div>
      )}
    </div>
  );
};

export default UserPage;
