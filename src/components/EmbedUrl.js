import React from 'react';
import { ReactEmbed } from 'react-embed';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const EmbedComponent = ({ url }) => {
    // For other URLs, use react-embed
    const getEmbedClassName = ({url}) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube-embed';
        if (url.includes('vimeo.com')) return 'vimeo-embed';
        if (url.includes('dailymotion.com')) return 'dailymotion-embed';
        if (url.includes('twitch.tv')) return 'twitch-embed';
        if (url.includes('soundcloud.com')) return 'soundcloud-embed';
        return 'generic-embed';
    };

  const renderEmbed = () => {
    if (ReactPlayer.canPlay(url)) {
      return (
        <div className={getEmbedClassName({url})}>
          <ReactPlayer
            url={url}
            controls
          />
        </div>
      );
    }

    // For Facebook embeds, use Facebook's SDK directly
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
      return (
        <div
          className="fb-video facebook-embed"
          data-href={url}
          data-width="100%"
          data-show-text="false"
        ></div>
      );
    }

    // For Spotify embeds
    if (url.includes('spotify.com')) {
      const embedUrl = url.replace('open.spotify.com', 'embed.spotify.com');
      return (
        <iframe
          className="spotify-embed"
          src={embedUrl}
          frameBorder="0"
          allow="encrypted-media"
        ></iframe>
      );
    }

    // Default to video element if URL ends with a video extension
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    if (videoExtensions.some(ext => url.endsWith(ext))) {
      return (
        <video className="video-embed" controls>
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      );
    }


    return (
        <div className={getEmbedClassName({url})}>
            <ReactEmbed url={url} />
        </div>
    );
  };

  return (
    <EmbedContainer>
      {renderEmbed()}
    </EmbedContainer>
  );
};

export default EmbedComponent;

const EmbedContainer = styled.div`
  width: 100%;

  div {
    width: 100% !important;
    height: 100% !important;
  }
    
    video {
        width: 100%;
        border-radius: 25px;
    }

    .youtube-embed,
    .vimeo-embed,
    .dailymotion-embed,
    .twitch-embed {
        width: 100%;
        border-radius: 25px;
        aspect-ratio: 16 / 9;
        overflow: hidden;
    }

    .soundcloud-embed {
        width: 100%;
        height: 100%;
        aspect-ratio: 16 / 12;
        border-radius: 25px;
        overflow: hidden;
    }

    .generic-embed {
        width: 100%;
        height: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 25px;
        overflow: hidden;

        span {
            width: 100% !important;
            height: 100% !important;

            iframe {
                width: 100% !important;
                height: 100% !important;

                ._9kkd {
                    padding-bottom: 56.25% !important;
                }
                #u_0_4_0f {
                    padding-bottom: 56.25% !important;}
            }
        }
    }

    .fb-video ._9kkd {
        padding-bottom: 56.25% !important;
    }

    .spotify-embed {
        width: 100%;
        height: 100%;
        border-radius: 25px;
        aspect-ratio: auto;
    }
`;
