import React from 'react';
import styles  from '@/styles/youtube.module.scss'

const YouTubeVideos = ({ videos }) => {
  // Get the latest 4 videos
  const latestVideos = videos.slice(0, 4);

  return (
    <div className={styles.youtubeInnerWrapper}>
      {latestVideos.map(video => (
        <div key={video.id.videoId} className={styles.youtubeContainer}>
          <div className={styles.iframeWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.snippet.title}
            ></iframe>
          </div>
          <p>{video.snippet.description}</p>
        </div>
      ))}
    </div>
  );
};

export default YouTubeVideos;
