'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'CV', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Projects', href: '/projects' },
  ];

  return (
    <nav className="flex gap-2 mb-8 print:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-skin-button-accent text-skin-inverted'
                : 'bg-skin-button-muted text-skin-base hover:bg-skin-button-muted/80'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

