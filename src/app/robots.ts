import { MetadataRoute } from 'next';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

export const dynamic = 'force-static';

const cv = cvData as unknown as CV;
const { name, url } = cv.basics;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
