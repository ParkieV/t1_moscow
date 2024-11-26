import {FC, useEffect, useState} from 'react';

interface ImageProps {
  src: string
}

export const ImageComponent: FC<ImageProps> = ({src}) => {
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = src;
  }, [src]);

  if (!imageExists) {
    return null; // Don't render anything if the image doesn't exist  
  }

  return <img src={src} alt={src}/>;
};