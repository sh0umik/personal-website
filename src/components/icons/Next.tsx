import React from 'react';

export const Next = ({ className = "size-4" }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993"></path>
    <path d="M15 12v-3"></path>
  </svg>
);

