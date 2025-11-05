'use client';

import React, { useEffect, useState } from 'react';
import { ThemeSwitch as ThemeIcon } from './icons/ThemeSwitch';

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<string>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    if (savedTheme !== null) {
      setTheme(savedTheme);
      updateTheme(savedTheme);
    } else {
      setTheme('system');
      updateTheme(systemTheme);
    }
  }, []);

  const updateTheme = (value: string) => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const finalTheme = value === 'system' ? systemTheme : value;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(finalTheme);
    localStorage.setItem('theme', value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTheme(value);
    updateTheme(value);
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      document.documentElement.classList.remove('dark');
    };

    const handleAfterPrint = () => {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
        document.documentElement.classList.add('dark');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="no-print inline-flex items-center">
      <div className="group/theme flex items-center gap-2">
        <label htmlFor="themeSwitch" className="flex items-center gap-1 text-sm font-medium leading-6 text-skin-base transition-transform ease-in-out group-hover/theme:rotate-45">
          <ThemeIcon />
        </label>
        <select
          id="themeSwitch"
          name="themeSwitch"
          value={theme}
          onChange={handleChange}
          className="focus:ring-skin-hue ring-skin-muted block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-skin-base ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6"
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>
  );
};

