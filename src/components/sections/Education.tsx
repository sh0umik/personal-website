'use client';

import React from 'react';
import { Section } from '../Section';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as CV;
const { education, certificates } = cv;

interface EducationProps {
  className?: string;
}

export const Education = ({ className }: EducationProps) => {
  return (
    <Section className={className} title="Education">
      <ul className="space-y-4 py-3 print:space-y-0">
        {education.map(({ institution, startDate, endDate, area, url }) => {
          let years = '';
          if (startDate && endDate) {
            const startYear = new Date(startDate).getFullYear();
            const endYear = endDate != null ? new Date(endDate).getFullYear() : 'Present';
            years = `${startYear} - ${endYear}`;
          } else if (startDate) {
            const startYear = new Date(startDate).getFullYear();
            years = `${startYear} - Present`;
          }

          return (
            <div key={`${institution}-${startDate}`} className="flex items-baseline">
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
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
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
                      {institution}
                    </a>
                  ) : (
                    <span>{institution}</span>
                  )}
                </h3>
                <div className="text-sm text-skin-muted">{area}</div>
                {years && <time className="right-0 top-0 text-xs text-skin-muted md:absolute md:block">{years}</time>}
              </div>
            </div>
          );
        })}
      </ul>

      {certificates.length > 0 && (
        <>
          <h4>Certificates</h4>
          <ul className="space-y-4 py-3 print:space-y-0">
            {certificates.map(({ name, date, issuer, url }) => {
              const certificateYear = new Date(date).getFullYear();
              return (
                <div key={`${name}-${date}`} className="flex items-baseline">
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
                    <path d="M15 12h-5" />
                    <path d="M15 8h-5" />
                    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
                  </svg>
                  <div className="relative w-full items-baseline justify-between gap-2">
                    <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                      <a
                        className="hover:text-skin-hue group flex items-center gap-[6px] text-skin-base decoration-dotted underline-offset-[5px] hover:underline"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {name}
                      </a>
                    </h3>
                    <div className="text-sm text-skin-muted">{issuer}</div>
                    <time className="right-0 top-0 text-xs text-skin-muted md:absolute md:block">{certificateYear}</time>
                  </div>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </Section>
  );
};

