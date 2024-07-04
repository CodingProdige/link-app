"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import axios from 'axios';
import styles from '@/styles/dashboardHome.module.scss';
import YouTubeCarousel from '@/components/YoutubeCarousel';
import PremiumBanner from '@/components/PremiumBanner';
import Loading from '@/components/Loading';
import {
  checkSubscriptionStatus,
  updatePremiumStatus,
  checkIfCodeExists,
  removeCode,
  fetchUserData,
  fetchUserAnalytics,
} from '@/utils/firebaseUtils';
import { YouTubeEmbed, LinkedInEmbed  } from 'react-social-media-embed';


export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [premiumCode, setPremiumCode] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);

  useEffect(() => {
    const fetchUserDataAndVideos = async () => {
      if (user) {
        try {
          const fetchedUserData = await fetchUserData(user.uid);
          setUserData(fetchedUserData);

          const fetchedUserAnalytics = await fetchUserAnalytics(user.uid);
          setUserAnalytics(fetchedUserAnalytics);

          const isSubscribed = fetchedUserData.premium || await checkSubscriptionStatus(user.uid);
          setIsSubscribed(isSubscribed);

          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
              maxResults: 5,
              order: 'date',
              key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
            },
          });
          setVideos(response.data.items);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserDataAndVideos();
  }, [user]);

  const handleActivatePremium = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const codeExists = await checkIfCodeExists(premiumCode);
      if (codeExists) {
        await updatePremiumStatus(user.uid, true);
        await removeCode(premiumCode);
        setIsSubscribed(true);
      } else {
        setError("Invalid premium code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while activating the premium code. Please try again.");
    }
  };

  const findTopReferrer = (referers = []) => {
    const referrerCounts = {};

    referers.forEach(({ referer }) => {
      referrerCounts[referer] = (referrerCounts[referer] || 0) + 1;
    });

    return Object.entries(referrerCounts).reduce((topReferrer, [referer, count]: [string, number]) => {
      return count > topReferrer.count ? { referer, count } : topReferrer;
    }, { referer: 'None Tracked', count: 0 }).referer;
  };

  const findLinkWithMostEvents = (links = []) => {
    return links.reduce((mostEventsLink, currentLink) => {
      const currentLinkEventsCount = currentLink.events.length;
      return currentLinkEventsCount > mostEventsLink.events.length ? currentLink : mostEventsLink;
    }, { events: [] });
  };

  const findTopLocation = (locations = []) => {
    const locationCounts = {};

    locations.forEach(({ city, country }) => {
      const locationKey = `${city}, ${country}`;
      locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
    });

    return Object.entries(locationCounts).reduce((topLocation, [location, count]: [string, number]) => {
      return count > topLocation.count ? { location, count } : topLocation;
    }, { location: 'None Tracked', count: 0 }).location;
  };

  if (authLoading || prismicLoading || loading) {
    return <Loading />;
  }

  const topLink = findLinkWithMostEvents(userAnalytics?.links || []);
  const topLocation = findTopLocation(userAnalytics?.locations || []);

  return (
    <div className={styles.dashboardPage}>
      {isSubscribed && (
        <div className={styles.sectionPremiumUserBanner}>
          <h3>Welcome, {user.username || user.displayName || user.email}!</h3>
          <div className={styles.premiumUserText}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightning-charge" viewBox="0 0 16 16">
              <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
            </svg>
            <p>Premium User</p>
          </div>
        </div>
      )}

      <div className={styles.sectionCards}>
        <div className={styles.card}>
          <h4>Last Visitor Location</h4>
          <p>{userAnalytics?.lastLocation || "None Tracked"}</p>
        </div>
        <div className={styles.card}>
          <h4>Top Visitor Location</h4>
          <p>{topLocation || "None Tracked"}</p>
        </div>
        <div className={styles.card}>
          <h4>Top Referrer</h4>
          <p>{findTopReferrer(userAnalytics?.referers) || "None Tracked"}</p>
        </div>
        <div className={styles.card}>
          <h4>Link with Most Events</h4>
          <p>{topLink.title || "None Tracked"}</p>
        </div>
      </div>

      {!isSubscribed && <PremiumBanner />}

      {!isSubscribed && (
        <div className={styles.sectionContainer}>
          <div className={styles.activatePremiumContainer}>
            <div className={styles.activatePremiumHeader}>
              <h3>Activate Premium</h3>
              <p>Enter your unique premium code to activate premium features.</p>
            </div>
            <form onSubmit={handleActivatePremium}>
              <input
                type="text"
                placeholder="Unique Premium Code"
                value={premiumCode}
                onChange={(e) => setPremiumCode(e.target.value)}
                className={error ? styles.inputError : ""}
              />
              <button type="submit">Activate</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}

      {/* {videos.length > 0 && (
        <div className={styles.sectionContainer}>
          <h4>Latest Fanslink Videos</h4>
          <YouTubeCarousel videos={videos} />
        </div>
      )} */}

      <div className={styles.sectionContainer}>
        <h4>Fanslink Youtube Channel</h4>
        <div className={styles.socialEmbed}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <YouTubeEmbed url="https://www.youtube.com/watch?v=DdqW8cSaXBk" width={300} height={200} />
          </div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h4>Fanslink Creator LinkedIn Profile</h4>
        <div className={styles.socialEmbed}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LinkedInEmbed 
              url="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7211372776195039234"
              postUrl="https://www.linkedin.com/posts/fanslink-link-in-bio-tool_exclusive-sneak-peek-my-new-link-in-bio-activity-7209537335284142080-K8r6?utm_source=share&utm_medium=member_desktop"
              width={300}
              height={570} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
