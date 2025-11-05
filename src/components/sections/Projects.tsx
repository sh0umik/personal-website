'use client';

import React from 'react';
import { Section } from '../Section';
import { Arrow } from '../icons/Arrow';
import { Git } from '../icons/Git';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { projects } = cv;

interface ProjectsProps {
  className?: string;
}

export const Projects = ({ className }: ProjectsProps) => {
  return (
    <Section className={className} title="Projects">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 print:flex print:flex-col">
        {projects.map(({ url, description, highlights, name, isActive, github }) => {
          return (
            <div
              key={name}
              role="contentinfo"
              className="grid-span-1 ring-skin-muted relative flex flex-col rounded-md bg-skin-button-muted/50 p-5 shadow-sm ring-1"
            >
              <div className="flex items-center justify-between space-x-[10px]">
                <div className="flex items-center gap-2">
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
                    className="lucide lucide-folder size-4"
                  >
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                  </svg>
                  <div className="flex items-center gap-[6px]">
                    {isActive && url ? (
                      <a
                        className="hover:text-skin-hue group flex items-center gap-[6px] text-lg decoration-dotted underline-offset-[5px] hover:underline"
                        href={url}
                        title={`Visit ${name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {name}
                        <span className="text-skin-hue transition ease-linear group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          <Arrow />
                        </span>
                      </a>
                    ) : (
                      <span>{name}</span>
                    )}
                  </div>
                </div>

                {github && (
                  <a
                    href={github}
                    title="View slug repository on GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-75 transition-opacity duration-100 hover:opacity-100"
                  >
                    <Git />
                  </a>
                )}
              </div>

              <p className="py-3 text-sm text-skin-base">{description}</p>
              <ul className="mt-1 text-sm text-skin-muted ml-4 list-disc space-y-1">
                {highlights.map((highlight, idx) => {
                  return <li key={idx}>{highlight}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

