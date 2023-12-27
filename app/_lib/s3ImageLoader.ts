'use client';

import { ImageLoaderProps } from 'next/image';

export default function s3ImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return src;
}
