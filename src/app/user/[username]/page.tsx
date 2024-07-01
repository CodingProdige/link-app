// components/UserPage.js
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
import VideoEmbed from '@/components/VideoEmbed';
import { THEMES } from '@/lib/constants';
import { trackUserVisit, trackLinkClick, trackLinkHover, trackDeviceType, trackVisitorLocation } from '@/utils/firebaseUtils';
import axios from 'axios';

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
  const [theme, setTheme] = useState(null);
  const initial = userData?.username?.toUpperCase();

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
        trackUserVisit(data.uid, document.referrer);  // Track user visit with referrer

        // Detect device type
        const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
        trackDeviceType(data.uid, deviceType);

        // Track visitor location
        const fetchVisitorLocation = async () => {
          try {
            const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=' + process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY);
            trackVisitorLocation(data.uid, response?.data);
            console.log('Visitor location:', response?.data);
          } catch (error) {
            console.error('Error fetching visitor location:', error);
          }
        };

        fetchVisitorLocation();

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
  const LinkComponent = ({ link, theme }) => {

    const handleLinkClick = (linkId, title) => {
      trackLinkClick(userData.uid, linkId, title);
    };

    const handleLinkHover = (linkId, title) => {
      trackLinkHover(userData.uid, linkId, title);
    };

    if (link?.layout === "classic" && link?.linkType === "external") {
      return (
        <Link
          className={styles.linkPill}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...theme?.PILLS, position: "relative" }}
          onClick={() => handleLinkClick(link.id, link.title)}
          onMouseEnter={() => handleLinkHover(link.id, link.title)}
        >
          <div className={styles.pillOpacityLayer} style={{ ...theme?.OPACITY_LAYER }}></div>
          <li className={styles.linkItem}>
            {link?.metadata?.metadata["og:icon"] ? (
              <div className={styles.selectedIcon}>
                <IconContext.Provider value={{ size: '32px' }}>
                  {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
                </IconContext.Provider>
              </div>
            ) : (
              <div className={styles.imageIconWrapper}>
                {link?.metadata?.metadata["og:image"] ? (
                  <div className={styles.linkImageContainer} style={{ backgroundImage: `url("${link.metadata.metadata["og:image"]}")` }}></div>
                ) : (
                  <div className={styles.emptyThumbnail}></div>
                )}
              </div>
            )}
            <p style={{ ...theme?.TEXT || {} }} className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
            <div className={styles.linkOptions}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-link-45deg"
                viewBox="0 0 16 16"
                style={{ ...theme?.TEXT || {} }}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
            </div>
          </li>
        </Link>
      );
    }

    if (link?.layout === "featured" && link?.linkType === "external") {
      return (
        <Link
          className={styles.linkPillFeatured}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          style={link?.metadata?.metadata["og:image"] ? { backgroundImage: `url("${link?.metadata?.metadata["og:image"]}")`, ...theme?.PILLS || "" } : { ...theme?.PILLS || "" }}
          onClick={() => handleLinkClick(link.id, link.title)}
          onMouseEnter={() => handleLinkHover(link.id, link.title)}
        >
          <div className={styles.pillOpacityLayer} style={{ ...theme?.OPACITY_LAYER }}></div>
          <li className={styles.linkItem}>
            <div className={styles.selectedIcon}>
              {link?.metadata?.metadata["og:icon"] && (
                <IconContext.Provider value={{ size: '32px' }}>
                  {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
                </IconContext.Provider>
              )}
            </div>
            <div className={styles.linkContent}>
              <p style={{ ...theme?.TEXT || {} }} className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
              <div className={styles.linkOptions}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-link-45deg"
                  viewBox="0 0 16 16"
                  style={{ ...theme?.TEXT || {} }}
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                </svg>
              </div>
            </div>
          </li>
        </Link>
      );
    }

    if (link?.linkType === "embed") {
      if (link?.metadata?.mediaType.includes("video")) {
        return (
          <div className={styles.linkPillVideo} style={{ ...theme?.PILLS }} onMouseEnter={() => handleLinkHover(link.id, link.title)}>
            <div className={styles.pillOpacityLayer} style={{ ...theme?.OPACITY_LAYER }}></div>
            <li className={styles.linkItem}>
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
                      <div className={styles.linkImageContainer} style={{ backgroundImage: `url("${link.metadata.metadata["og:image"]}")` }}></div>
                    ) : (
                      <div className={styles.emptyThumbnail}></div>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.linkContent}>
                <p style={{ ...theme?.TEXT || {} }} className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
                <div className={styles.linkOptions}>
                  <svg
                    onClick={() => handleShareLink(link.link)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-copy"
                    viewBox="0 0 16 16"
                    style={{ ...theme?.TEXT || {} }}
                  >
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                  </svg>
                </div>
              </div>
            </li>
            <VideoEmbed url={`${link?.link}`} />
          </div>
        );
      } else if (link?.metadata?.mediaType.includes("music")) {
        return (
          <div className={styles.linkPillMusic} style={{ ...theme?.PILLS }} onMouseEnter={() => handleLinkHover(link.id, link.title)}>
            <div className={styles.pillOpacityLayer} style={{ ...theme?.OPACITY_LAYER }}></div>
            <li className={styles.linkItem}>
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
                      <div className={styles.linkImageContainer} style={{ backgroundImage: `url("${link.metadata.metadata["og:image"]}")` }}></div>
                    ) : (
                      <div className={styles.emptyThumbnail}></div>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.linkContent}>
                <p style={{ ...theme?.TEXT || {} }} className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
                <div className={styles.linkOptions}>
                  <svg
                    onClick={() => handleShareLink(link.link)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-copy"
                    viewBox="0 0 16 16"
                    style={{ ...theme?.TEXT || {} }}
                  >
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                  </svg>
                </div>
              </div>
            </li>
            <VideoEmbed url={`${link?.link}`} />
          </div>
        );
      }
    }

    if (link?.linkType === "external") {
      return (
        <Link
          className={styles.linkPill}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...theme?.PILLS }}
          onClick={() => handleLinkClick(link.id, link.title)}
          onMouseEnter={() => handleLinkHover(link.id, link.title)}
        >
          <div className={styles.pillOpacityLayer} style={{ ...theme?.OPACITY_LAYER }}></div>
          <li className={styles.linkItem}>
            {link?.metadata?.metadata["og:icon"] ? (
              <div className={styles.selectedIcon}>
                <IconContext.Provider value={{ size: '32px' }}>
                  {React.createElement(FaIcons[link?.metadata?.metadata["og:icon"]])}
                </IconContext.Provider>
              </div>
            ) : (
              <div className={styles.imageIconWrapper}>
                {link?.metadata?.metadata["og:image"] ? (
                  <div className={styles.linkImageContainer} style={{ backgroundImage: `url("${link.metadata.metadata["og:image"]}")` }}></div>
                ) : (
                  <div className={styles.emptyThumbnail}></div>
                )}
              </div>
            )}
            <p style={{ ...theme?.TEXT || {} }} className={styles.linkTitle}>{link.title ? link.title : "Title"}</p>
            <div className={styles.linkOptions}>
              {/* Optional link options */}
            </div>
          </li>
        </Link>
      );
    }

    return null; // Return null for unsupported layouts or link types
  };

  const handleShareLink = async ({ url }) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy the link: ', err);
    }
  };

  return (
    <div className={styles.containerPublicProfile}>
      <div
        className={styles.background}
        style={{
          ...(theme?.BACKGROUND_MEDIA == "color" && { backgroundColor: theme?.BACKGROUND.backgroundColor || {} }),
          ...(theme?.BACKGROUND_MEDIA == "gradient" && theme?.GRADIENT_ONE && theme?.GRADIENT_TWO && {
            backgroundImage: `linear-gradient(${theme?.GRADIENT_ANGLE || 0}deg, ${theme?.GRADIENT_ONE}, ${theme?.GRADIENT_TWO})`
          })
        }}
      >
        {theme?.BACKGROUND_VIDEO?.videoUrl && theme?.BACKGROUND_MEDIA == 'video' && (
          <video
            autoPlay
            loop
            muted
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `blur(${theme?.BACKGROUND_VIDEO?.filter || '0'}px)` || '0',
            }}
          >
            <source src={theme?.BACKGROUND_VIDEO?.videoUrl || ''} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {theme?.BACKGROUND_IMAGE?.imageUrl && theme?.BACKGROUND_MEDIA == 'image' && (
          <Image
            src={theme?.BACKGROUND_IMAGE.imageUrl || ''}
            alt={theme?.NAME || ''}
            layout="fill"
            objectFit="cover"
            style={{
              objectPosition: 'center',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              filter: `blur(${theme?.BACKGROUND_IMAGE?.filter || '0'}px)` || '0',
            }}
          />
        )}
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.profileContainer}>
          <div
            className={styles.profileImageContainer}
            style={
              userData?.photoUrl ? { backgroundImage: `url(${userData?.photoUrl})` } : { backgroundColor: '#000000' }
            }
          >
            {!userData?.photoUrl && (
              <h2>{initial.split('')[0]}</h2>
            )}
          </div>
          <div className={styles.nameContainer}>
            {userData?.title && (
              <p
                style={{ ...theme?.HEADER_TEXT }}
                className={styles.username}
              >
                {userData?.title ? userData?.title : userData?.username}
              </p>
            )}
            {userData?.bio && (
              <p
                style={{ ...theme?.HEADER_TEXT }}
                className={styles.linkBio}
              >
                {userData?.bio ? userData?.bio : "Bio"}
              </p>
            )}
          </div>
        </div>
        {userData?.links && (
          <div className={styles.linksContainer}>
            <ul className={styles.linksList}>
              {userData?.links.map((link) => (
                <div className={styles.linkWrapper} key={link.id}>
                  {link?.active && (
                    <LinkComponent link={link} theme={theme} />
                  )}
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
      {userData?.showLogo && userData?.showLogo !== false && (
        <div className={styles.fanslinkLogo}>
          <PrismicNextImage field={settings.data.logo} className={styles.fanslinkLogoImage} />
        </div>
      )}
    </div>
  );
};

export default UserPage;
