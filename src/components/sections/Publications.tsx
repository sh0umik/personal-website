'use client';

import React from 'react';
import { Section } from '../Section';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { publications } = cv;

interface PublicationsProps {
  className?: string;
}

export const Publications = ({ className }: PublicationsProps) => {
  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <Section className={className} title="Publications">
      <ul className="space-y-4 py-3 print:space-y-0">
        {publications.map(({ name, publisher, releaseDate, url, summary }) => {
          const publicationYear = releaseDate ? new Date(releaseDate).getFullYear() : '';

          return (
            <div key={`${name}-${releaseDate}`} className="flex items-baseline">
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
                className="mr-2 hidden h-5 w-5 self-start md:inline-block print:hidden"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <div className="relative w-full items-baseline justify-between gap-2">
                <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                  {url ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-skin-hue group flex items-center gap-[6px] decoration-dotted underline-offset-[5px] hover:underline"
                      href={url}
                    >
                      {name}
                    </a>
                  ) : (
                    <span>{name}</span>
                  )}
                </h3>
                <div className="text-sm text-skin-muted italic">{publisher}</div>
                {summary && <div className="mt-1 text-sm text-skin-muted">{summary}</div>}
                {publicationYear && (
                  <time className="right-0 top-0 text-xs text-skin-muted md:absolute md:block">
                    {publicationYear}
                  </time>
                )}
              </div>
            </div>
          );
        })}
      </ul>
    </Section>
  );
};

