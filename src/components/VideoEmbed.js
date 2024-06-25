import React from 'react';
import getVideoId from 'get-video-id';
import ReactPlayer from 'react-player';
import styles from '@/styles/videoEmbed.module.scss';
import { Spotify } from 'react-spotify-embed';
import  Link  from 'next/link';

const VideoEmbed = ({ url }) => {
  const { id, service } = getVideoId(url);

  let srcUrl = '';
  let aspectRatio = '16:9'; // Default aspect ratio
  let isMusicPlatform = false;

  if (id && service) {
    switch (service) {
      case 'youtube':
        srcUrl = `https://www.youtube.com/embed/${id}`;
        break;
      case 'vimeo':
        srcUrl = `https://player.vimeo.com/video/${id}`;
        break;
      case 'dailymotion':
        srcUrl = `https://www.dailymotion.com/embed/video/${id}`;
        break;
      case 'vine':
        srcUrl = `https://vine.co/v/${id}/embed/simple`;
        aspectRatio = '1:1'; // Adjusting to Vine's aspect ratio
        break;
      case 'videopress':
        srcUrl = `https://videopress.com/embed/${id}`;
        break;
      case 'stream':
        srcUrl = `https://web.microsoftstream.com/embed/video/${id}`;
        break;
      case 'tiktok':
        srcUrl = `https://www.tiktok.com/embed/v2/${id}`;
        aspectRatio = '9:16'; // Adjusting to TikTok's aspect ratio
        break;
      case 'loom':
        srcUrl = `https://www.loom.com/embed/${id}`;
        break;
      default:
        break;
    }
  } else {
    // Check if it's a music or other platform supported by ReactPlayer
    isMusicPlatform = ReactPlayer.canPlay(url);
  }

  const getPaddingBottom = (aspectRatio) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

  const renderMusicEmbed = (platform, embedUrl, url) => (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '25px', overflow: 'hidden' }}>
      <iframe
        title={`${platform}-widget`}
        src={embedUrl}
        width="100%"

        frameBorder="0"
        allowTransparency="true"
        allow="encrypted-media; clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      ></iframe>
      <Link href={url}>{url}</Link>
    </div>
  );

  if (url.includes('spotify.com')) {
    const embedUrl = url.replace('open.spotify.com', 'embed.spotify.com');
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <Spotify wide link={embedUrl} />
      </div>
    );
  }

  if (url.includes('deezer.com')) {
    const albumId = url.split('/album/')[1];
    const embedUrl = `https://widget.deezer.com/widget/dark/album/${albumId}`;
    return renderMusicEmbed('deezer', embedUrl, url);
  }

  if (url.includes('music.apple.com')) {
    const embedUrl = url.replace('music.apple.com', 'embed.music.apple.com');
    return renderMusicEmbed('apple-music', embedUrl, url);
  }

  if (url.includes('tidal.com')) {
    const embedUrl = `https://embed.tidal.com/${url.split('.com/')[1]}`;
    return renderMusicEmbed('tidal', embedUrl, url);
  }

  if (url.includes('music.youtube.com')) {
    const embedUrl = url.replace('music.youtube.com', 'www.youtube.com/embed');
    return renderMusicEmbed('youtube-music', embedUrl, url);
  }

  if (url.includes('music.amazon.com')) {
    const embedUrl = `https://music.amazon.com/embed/${url.split('.com/')[1]}`;
    return renderMusicEmbed('amazon-music', embedUrl, url);
  }

  if (url.includes('pandora.com')) {
    const embedUrl = url.replace('pandora.com', 'embed.pandora.com');
    return renderMusicEmbed('pandora', embedUrl, url);
  }

  if (url.includes('music.yandex.ru')) {
    const embedUrl = `https://music.yandex.ru/embed/track/${url.split('/track/')[1]}`;
    return renderMusicEmbed('yandex-music', embedUrl, url);
  }

  if (url.includes('itunes.apple.com')) {
    const embedUrl = url.replace('itunes.apple.com', 'embed.itunes.apple.com');
    return renderMusicEmbed('itunes', embedUrl, url);
  }

  if (url.includes('amazon.com')) {
    const embedUrl = `https://www.amazon.com/embed/${url.split('.com/')[1]}`;
    return renderMusicEmbed('amazon', embedUrl, url);
  }

  if (url.includes('anghami.com')) {
    const embedUrl = `https://play.anghami.com/widget/${url.split('/song/')[1]}`;
    return renderMusicEmbed('anghami', embedUrl, url);
  }

  if (isMusicPlatform) {
    return (
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '25px', overflow: 'hidden' }}>
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          controls
        />
      </div>
    );
  }

  if (srcUrl) {
    return (
      <div style={{ position: 'relative', width: '100%', paddingBottom: getPaddingBottom(aspectRatio) }}>
        <iframe
          src={srcUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Embed"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '25px'}}
        ></iframe>
      </div>
    );
  }

  return <Link href={url} className={styles.videoLink}>{url}</Link>;
};

export default VideoEmbed;
