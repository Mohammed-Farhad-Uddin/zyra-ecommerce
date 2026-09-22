'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { FALLBACK_IMAGE } from '@/lib/utils';

type SmartImageProps = Omit<ImageProps, 'src' | 'onError'> & {
  src?: string | null;
};

/** next/image with a graceful local fallback for missing or unreachable product photos. */
export function SmartImage({ src, alt, ...props }: SmartImageProps) {
  const [current, setCurrent] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setCurrent(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={() => setCurrent(FALLBACK_IMAGE)}
    />
  );
}
