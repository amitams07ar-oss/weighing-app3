import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  style: React.CSSProperties;
}

const FallingStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const numStars = 100;
      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 2 + 1; // Star size between 1px and 3px
        const animationDuration = Math.random() * 5 + 5; // Duration between 5s and 10s
        const animationDelay = Math.random() * 10; // Delay up to 10s
        const left = Math.random() * 100;

        newStars.push({
          id: i,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}vw`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
          },
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div id="stars-container" className="fixed inset-0 -z-10 overflow-hidden">
      {stars.map((star) => (
        <div key={star.id} className="star" style={star.style} />
      ))}
    </div>
  );
};

export default FallingStars;