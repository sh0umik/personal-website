'use client';

import React from 'react';
import { Section } from '../Section';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as CV;
const { summary } = cv.basics;

export const About = () => {
  return (
    <Section title="About">
      <p>{summary}</p>
    </Section>
  );
};

