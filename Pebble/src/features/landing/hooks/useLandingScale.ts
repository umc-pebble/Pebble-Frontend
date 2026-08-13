import { useEffect, useState } from 'react';

const FIGMA_WIDTH = 1440;

export function useLandingScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / FIGMA_WIDTH;
      setScale(Math.min(widthScale, 1));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return scale;
}