'use client';

import { useEffect } from 'react';

const perkImages = ['/speed.png', '/slow.png', '/invert.png'];

export function PreloadPerkImages() {
  useEffect(() => {
    perkImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);
  return null;
}
