import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const YouTubeCarousel = ({ videos }) => {
  return (
    <Carousel showThumbs={true} infiniteLoop useKeyboardArrows autoPlay 
        showArrows={true} showStatus={true} showIndicators={true}
        thumbWidth={100} thumbHeight={50}
        interval={5000} stopOnHover={true}
        swipeable={true} dynamicHeight={false}
        emulateTouch={true} autoFocus={false}
        centerMode={false} centerSlidePercentage={50}
        swipeScrollTolerance={5}
        selectedItem={0}
        style={{ height: '50rem', width: '100%' }}

    >
      {videos.map(video => (
        <div key={video.id.videoId}>
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
    </Carousel>
  );
};

export default YouTubeCarousel;
