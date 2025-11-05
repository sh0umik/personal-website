import React from 'react';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Tail } from '@/components/sections/Tail';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { KeyboardManager } from '@/components/KeyboardManager';
import { Navigation } from '@/components/Navigation';
import projectsData from '@/data/projects.json';
import { Arrow } from '@/components/icons/Arrow';
import { Git } from '@/components/icons/Git';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { name, url } = cv.basics;

export const metadata: Metadata = {
  title: `Projects | ${name}`,
  description: `Projects by ${name} - Open source contributions, tools, and applications built with Golang, microservices, and modern technologies.`,
  alternates: {
    canonical: `${url}/projects`,
  },
};

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    folder: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    ),
    database: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    code: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    link: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    medical: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  };

  return icons[iconName] || icons.folder;
};

export default function ProjectsPage() {
  // JSON-LD Schema for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} Projects`,
    description: `Projects by ${name} - Open source contributions, tools, and applications.`,
    url: `${url}/projects`,
    author: {
      '@type': 'Person',
      name: name,
      url: url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <main className="relative grid max-w-7xl gap-12 p-8 max-sm:py-16 md:grid-cols-6 md:p-16 xl:gap-24 print:max-w-none print:grid-cols-1 print:gap-6 flex-1 mx-auto w-full">
          <div className="space-y-6 md:col-span-2 print:col-span-1 print:grid print:grid-cols-2 print:gap-5 print:space-y-0">
            <Hero />
            <About />
            <ThemeSwitch />
          </div>
          <div className="space-y-8 md:col-span-4 print:col-span-1 print:grid print:grid-cols-4 print:gap-2 print:space-y-0">
            <div className="md:col-span-4">
              <Navigation />
            </div>
            <div className="space-y-6 md:col-span-4">
              <h1 className="text-3xl font-bold text-skin-base">Projects</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {projectsData.map((project) => (
                  <div
                    key={project.id}
                    className="group relative flex flex-col rounded-lg border border-skin-muted bg-skin-button-muted/30 p-6 transition-all hover:border-skin-hue/50 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-skin-hue">{getIcon(project.icon)}</div>
                        <h2 className="text-lg font-semibold text-skin-base group-hover:text-skin-hue transition-colors">
                          {project.title}
                        </h2>
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          title="View on GitHub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-75 transition-opacity hover:opacity-100"
                        >
                          <Git />
                        </a>
                      )}
                    </div>

                    <p className="text-sm text-skin-muted mb-4 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-md bg-skin-button-muted text-skin-muted border border-skin-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-skin-hue hover:underline group/link"
                      >
                        Visit project
                        <span className="text-skin-hue transition ease-linear group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                          <Arrow />
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <KeyboardManager />
        </main>
        <Tail />
      </div>
    </>
  );
}
