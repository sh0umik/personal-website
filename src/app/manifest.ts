import { MetadataRoute } from 'next';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

export const dynamic = 'force-static';

const cv = cvData as unknown as CV;
const { name, summary, url } = cv.basics;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${name} Portfolio`,
    short_name: name,
    description: summary,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

