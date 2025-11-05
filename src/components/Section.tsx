import React from 'react';

interface SectionProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  titleAction?: React.ReactNode;
}

export const Section = ({ title, className, children, titleAction }: SectionProps) => {
  return (
    <section className={`flex flex-col gap-4 print:gap-0 ${className || ''}`}>
      {title && (
        <h3 className="relative flex w-full items-center justify-between gap-3 pb-4 text-3xl print:gap-1 print:pb-0 print:text-xl">
          <span>{title}</span>
          {titleAction && <div className="print:hidden">{titleAction}</div>}
        </h3>
      )}
      {children}
    </section>
  );
};

