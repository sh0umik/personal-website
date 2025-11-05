'use client';

import React, { useState } from 'react';
import { Section } from '../Section';
import { HTML } from '../icons/HTML';
import { CSS } from '../icons/CSS';
import { JavaScript } from '../icons/JavaScript';
import { TypeScript } from '../icons/TypeScript';
import { ReactIcon } from '../icons/React';
import { Node } from '../icons/Node';
import { MySQL } from '../icons/MySQL';
import { Git } from '../icons/Git';
import { GitHub } from '../icons/GitHub';
import { Tailwind } from '../icons/Tailwind';
import { Next } from '../icons/Next';
import { Swift } from '../icons/Swift';
import { SwiftUI } from '../icons/SwiftUI';
import { Kotlin } from '../icons/Kotlin';
import { Flutter } from '../icons/Flutter';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { work } = cv;

const SKILLS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HTML,
  CSS,
  JavaScript,
  TypeScript,
  React: ReactIcon,
  Node,
  MySQL,
  Git,
  GitHub,
  Next,
  Tailwind,
  Swift,
  SwiftUI,
  Kotlin,
  Flutter,
};

interface ExperienceProps {
  className?: string;
}

export const Experience = ({ className }: ExperienceProps) => {
  const downloadButton = (
    <a
      href="/Fahim-Shariar-Shoumik-CV.pdf"
      download="Fahim-Shariar-Shoumik-CV.pdf"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-skin-base bg-skin-button-muted hover:bg-skin-button-muted/80 rounded-md transition-colors border border-skin-muted"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download my CV
    </a>
  );

  return (
    <Section className={className} title="Experience" titleAction={downloadButton}>
      <ul className="flex flex-col">
        {work.map(({ name, startDate, endDate, position, summary, responsibilities, achievements, url, skills, location, location_type }) => {
          const startYear = new Date(startDate).getFullYear();
          const endYear = endDate != null ? new Date(endDate).getFullYear() : 'Present';

          return (
            <ExperienceItem
              key={`${name}-${startDate}`}
              name={name}
              position={position}
              startYear={startYear}
              endYear={endYear}
              startDate={startDate}
              endDate={endDate}
              summary={summary}
              responsibilities={responsibilities}
              achievements={achievements}
              url={url}
              skills={skills}
              location={location}
              location_type={location_type}
            />
          );
        })}
      </ul>
    </Section>
  );
};

interface ExperienceItemProps {
  name: string;
  position: string;
  startYear: number;
  endYear: number | string;
  startDate: string;
  endDate: string | null;
  summary: string | string[];
  responsibilities?: string[];
  achievements?: string[];
  url?: string;
  skills?: string[];
  location?: string;
  location_type?: string;
}

const ExperienceItem = ({
  name,
  position,
  startYear,
  endYear,
  startDate,
  endDate,
  summary,
  responsibilities,
  achievements,
  url,
  skills,
  location,
  location_type,
}: ExperienceItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="relative print:py-2">
      <div className="group relative grid pb-1 print:pb-0 transition-all print:grid-cols-1 print:gap-1 sm:grid-cols-12 sm:gap-8 md:gap-6 lg:hover:!opacity-100">
        <header className="relative mt-1 text-xs font-semibold sm:col-span-2">
          <time dateTime={startDate} title={startDate}>
            {startYear}
          </time>{' '}
          -{' '}
          <time dateTime={endDate || undefined} title={endDate || undefined}>
            {endYear}
          </time>
        </header>
        <div className="relative flex flex-col pb-6 print:pb-0 before:-ml-6 sm:col-span-10 before:w-px print:before:hidden before:absolute before:bg-skin-muted before:h-full before:mt-2">
          <div className="absolute w-2 h-2 bg-skin-muted rounded-full mt-2 -translate-x-[1.71rem] ring print:hidden ring-skin-fill"></div>
          <h3>
            <div
              className="inline-flex items-center text-lg print:text-base leading-tight group/link focus-visible:text-amber-500"
              aria-label={`${position} - ${name}`}
            >
              <span>
                {position} <span>@</span>{' '}
                {url ? (
                  <a className="text-skin-hue" href={url} title={`Ver ${name}`} target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                ) : (
                  <span>{name}</span>
                )}
                {url && (
                  <span className="inline-block text-skin-hue print:[&>svg]:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline-block w-4 h-4 ml-1 transition-transform translate-y-px shrink-0 group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                )}
              </span>
            </div>
          </h3>
          {(location || location_type) && (
            <div className="text-xs text-skin-muted">
              {location} {location && location_type && '-'} {location_type}
            </div>
          )}
          <div className="mt-4 print:gap-0 flex flex-col gap-4 print:text-xs text-sm">
            {summary && (
              <div className="flex flex-col gap-1">
                <h4>Summary:</h4>
                <ul className="text-skin-muted [&>li]:ml-4 flex list-disc flex-col gap-2">
                  {Array.isArray(summary) ? (
                    summary.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li>{summary}</li>
                  )}
                </ul>
              </div>
            )}

            {(responsibilities || achievements) && (
              <div
                className={`md:after:from-skin-hue dark:md:after:to-skin-hue/0 flex relative flex-col max-sm:!h-auto print:!h-auto gap-4 print:gap-2 md:after:bg-gradient-to-t md:after:absolute md:after:bottom-0 md:after:w-full print:after:hidden md:after:h-12 md:after:content-[''] ${expanded ? 'after:hidden' : ''}`}
                style={{ display: expanded ? 'flex' : 'none' }}
              >
                {responsibilities && (
                  <div className="flex flex-col gap-1">
                    <h4>Responsibilities:</h4>
                    <ul className="text-skin-muted [&>li]:ml-4 flex list-disc flex-col gap-2">
                      {responsibilities.map((responsibility, idx) => (
                        <li key={idx}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {achievements && (
                  <div className="flex flex-col gap-1">
                    <h4>Achievements:</h4>
                    <ul className="text-skin-muted [&>li]:ml-4 flex list-disc flex-col gap-2">
                      {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {(responsibilities || achievements) && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="print:hidden group/more w-fit cursor-pointer items-center justify-center gap-1.5 text-xs underline text-skin-muted transition-all hover:text-skin-base flex"
              >
                <span>{expanded ? 'Show less' : 'Show more'}</span>
                <svg
                  className={`w-4 h-4 group-hover/more:translate-y-0.5 duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}

            {skills && (
              <ul className="flex print:hidden flex-wrap gap-2" aria-label="Technologies used">
                {skills.map((skill) => {
                  const iconName = skill === 'Next.js' ? 'Next' : skill;
                  const Icon = SKILLS_ICONS[iconName];
                  return (
                    <li
                      key={skill}
                      className="bg-skin-button-accent/20 border-skin-hue/20 text-skin-hue print:p-0 print:bg-transparent print:text-zinc-800 flex gap-1 items-center border-solid print:border-none border rounded-md px-2 py-0.5 text-xs"
                    >
                      {Icon && <Icon />} <span>{skill}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

