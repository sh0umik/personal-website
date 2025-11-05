'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '../Section';
import { Mail } from '../icons/Mail';
import { Phone } from '../icons/Phone';
import { GitHub } from '../icons/GitHub';
import { LinkedIn } from '../icons/LinkedIn';
import { X } from '../icons/X';
import { WorldMap } from '../icons/WorldMap';
import { Globe } from '../icons/Globe';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { name, label, image, location, profiles, phone, email, url } = cv.basics;
const { city, region } = location;

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub,
  LinkedIn,
  X,
  Apito: Globe,
};

const linkedInfo = profiles.find(({ network }) => network === 'LinkedIn');
const linkedUrl = linkedInfo?.url;

const printInfo = [email, phone, linkedUrl].filter(Boolean).join(' • ');

export const Hero = () => {
  const [copyNotification, setCopyNotification] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopyNotification(true);
    setTimeout(() => {
      setCopyNotification(false);
    }, 3000);
  };

  return (
    <Section>
      <div className="flex flex-col-reverse gap-8">
        <div className="info flex flex-col gap-1 pr-8 print:gap-0 print:pr-0">
          <h1 className="text-4xl font-bold print:text-3xl">{name}</h1>
          <h2 className="text-balance text-base text-skin-muted print:text-lg">{label}</h2>
          <div className="flex items-center gap-2 pt-2 text-sm text-skin-muted">
            <WorldMap />
            {city}, {region}
          </div>
          <footer className="print mt-2 flex gap-1 text-sm">
            {printInfo}
          </footer>
          <footer className="no-print mt-2 flex gap-1 text-sm">
            {email && (
              <div className="relative flex items-center">
                {copyNotification && (
                  <div className="absolute left-0 -mt-1.5 flex h-7 -translate-y-full items-center rounded border-r border-green-500 bg-green-500 px-3 text-xs text-white transition ease-out duration-300">
                    <span className="!text-white">Copied!</span>
                    <div className="absolute left-0 bottom-0 inline-block h-full translate-x-full translate-y-5 overflow-hidden">
                      <div className="h-3 w-3 origin-center rotate-45 transform border border-transparent bg-green-500" />
                    </div>
                  </div>
                )}
                <button
                  onClick={copyToClipboard}
                  className="group flex h-8 w-9 cursor-pointer items-center justify-center rounded-md text-skin-muted hover:bg-skin-button-accent hover:text-skin-inverted [&>span]:hover:text-skin-inverted"
                >
                  {copyNotification ? (
                    <svg
                      className="h-4 w-4 stroke-current text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span>
                      <Mail />
                    </span>
                  )}
                </button>
              </div>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                title={`Call ${name} at ${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-md p-1 transition-all duration-500 ease-linear text-skin-hue hover:bg-skin-button-accent hover:text-skin-inverted"
              >
                <Phone />
              </a>
            )}
            {profiles.map(({ network, url }) => {
              const Icon = SOCIAL_ICONS[network];
              if (!Icon) return null;

              return (
                <a
                  key={network}
                  href={url}
                  title={`Visit ${name} profile on ${network}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-8 items-center justify-center rounded-md p-1 transition-all duration-500 ease-linear text-skin-hue hover:bg-skin-button-accent hover:text-skin-inverted"
                >
                  <Icon />
                </a>
              );
            })}
            {url && (
              <a
                href={url}
                title={`Visit ${name}'s website`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-md p-1 transition-all duration-500 ease-linear text-skin-hue hover:bg-skin-button-accent hover:text-skin-inverted"
              >
                <Globe />
              </a>
            )}
            <div className="no-print footer-button max-sm:hidden group flex h-8 w-9 cursor-pointer items-center justify-center rounded-md text-skin-hue hover:bg-skin-button-accent hover:text-skin-inverted [&>span]:hover:text-skin-inverted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon h-6 w-6 icon-tabler icon-tabler-command"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path>
              </svg>
            </div>
          </footer>
        </div>
        <figure className="print:hidden w-fit relative">
          <img className="shadow-lg shadow-skin-hues aspect-square w-32 rounded-2xl bg-cover" src={image} alt={name} />
          <div className="pointer-events-none absolute -inset-2">
            <div className="absolute -inset-y-8 right-0 w-px bg-skin-hue/50 [mask-image:linear-gradient(to_top,transparent,white_4rem,white_calc(100%-4rem),transparent)]"></div>
            <div className="absolute -inset-y-8 left-0 w-px bg-skin-hue/50 [mask-image:linear-gradient(to_top,transparent,white_4rem,white_calc(100%-4rem),transparent)]"></div>
            <div className="absolute -inset-x-8 bottom-0 h-px bg-skin-hue/50 [mask-image:linear-gradient(to_left,transparent,white_4rem,white_calc(100%-4rem),transparent)]"></div>
            <div className="absolute -inset-x-8 top-0 h-px bg-skin-hue/50 [mask-image:linear-gradient(to_left,transparent,white_4rem,white_calc(100%-4rem),transparent)]"></div>
          </div>
        </figure>
      </div>
    </Section>
  );
};

