"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import axios from 'axios';
import styles from '@/styles/dashboardHome.module.scss';
import YouTubeCarousel from '@/components/YouTubeCarousel';
import Image from 'next/image';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (authLoading || prismicLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardPage}>

      <div className={styles.premiumBannerContainer}>
        <Image src="/images/premium-banner.png" alt="Premium banner" width={1200} height={200} />
      </div>

      {videos.length > 0 && (
        <div className={styles.sectionContainer}>
          <h2>Latest Fanslink Videos</h2>
          <YouTubeCarousel videos={videos} />
        </div>
      )}
    </div>
  );
}
