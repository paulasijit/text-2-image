import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import './Carousel.css';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const imageRef = useRef(null);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handleFullScreen = () => {
    if (imageRef.current && imageRef.current.requestFullscreen) {
        imageRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        imageRef.current.classList.add('fullscreen-fallback');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `Image-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="carousel">
      <button onClick={goToPrevious} className="nav-button">
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div className="image-container"
           onMouseEnter={() => setHovered(true)}
           onMouseLeave={() => setHovered(false)}>
        <img ref={imageRef} src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
        {hovered && (
          <div className="carousel-controls">
            <button onClick={handleFullScreen}><FontAwesomeIcon icon={faExpand} /></button>
            <button onClick={handleDownload}><FontAwesomeIcon icon={faDownload} /></button>
          </div>
        )}
      </div>
      <button onClick={goToNext} className="nav-button">
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
  
  
};

export default Carousel;
