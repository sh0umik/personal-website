import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { url } = cv.basics;

async function getBlogPosts() {
  const contentDir = path.join(process.cwd(), 'src', 'app', 'blog', 'content');
  try {
    const files = await fs.readdir(contentDir);
    return files.filter((file) => file.endsWith('.md')).map((file) => file.replace('.md', ''));
  } catch (error) {
    return [];
  }
}

function getBlogMetadata(slug: string) {
  const metadata: Record<string, { date: string }> = {
    'microservices-ken-kokhon-kibhabe-part-2': {
      date: '2018-08-28',
    },
    'continuous-integration-of-golang-with-gitlab-pipeline-part-1': {
      date: '2018-02-22',
    },
    'nosql-database-part-1': {
      date: '2018-02-03',
    },
    'web-development-docker-php-oracle-part-2-1': {
      date: '2017-07-03',
    },
    'microservices-architecture-part-1': {
      date: '2017-06-25',
    },
    'docker-ki-part-1': {
      date: '2017-04-04',
    },
  };
  return metadata[slug] || { date: new Date().toISOString().split('T')[0] };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();

  const blogUrls = blogPosts.map((slug) => {
    const metadata = getBlogMetadata(slug);
    return {
      url: `${url}/blog/${slug}`,
      lastModified: new Date(metadata.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
