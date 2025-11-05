import React from 'react';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Skills } from '@/components/sections/Skills';
import { Publications } from '@/components/sections/Publications';
import { Education } from '@/components/sections/Education';
import { Tail } from '@/components/sections/Tail';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { KeyboardManager } from '@/components/KeyboardManager';
import { Navigation } from '@/components/Navigation';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { name, label, summary, url } = cv.basics;

export const metadata: Metadata = {
  title: {
    default: `${name} Portfolio - ${label}`,
    template: `%s | ${name} Portfolio`,
  },
  description: summary,
  keywords: ['portfolio', 'backend engineer', 'golang', 'microservices', 'software engineer', name],
  alternates: {
    canonical: url,
  },
};

export default function Home() {
  // JSON-LD Schema for Person
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: label,
    description: summary,
    url: url,
    sameAs: cv.basics.profiles.map((p) => p.url),
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
          <div className="space-y-12 md:col-span-4 print:col-span-1 print:grid print:grid-cols-4 print:gap-2 print:space-y-0">
            <div className="md:col-span-4">
              <Navigation />
            </div>
            <Experience className="print:col-span-3 md:col-span-4" />
            <Skills className="print:hidden md:col-span-4" />
            <Publications className="md:col-span-4" />
            <Education className="order-first md:col-span-4" />
          </div>
          <KeyboardManager />
        </main>
        <Tail />
      </div>
    </>
  );
}
