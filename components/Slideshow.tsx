import React, { useState, useEffect } from 'react';

interface SlideshowProps {
  images: string[];
  interval?: number; // milliseconds
  className?: string;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  images,
  interval = 3000, // default 3 seconds
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // fade transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full h-48 overflow-hidden rounded-t-2xl ${className}`}>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}

      {/* Optional: Slideshow indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
