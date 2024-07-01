"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import axios from 'axios';
import styles from '@/styles/dashboardHome.module.scss';



export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <h2>Latest YouTube Videos</h2>
      <div>
        {videos.map(video => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.snippet.title}
            ></iframe>
            <p>{video.snippet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
