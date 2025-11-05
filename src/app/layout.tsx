import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import cvData from '@/data/cv.json';
import type { CV } from '@/types';

const cv = cvData as unknown as CV;
const { name, label, summary, url, theme } = cv.basics;

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${name} Portfolio - ${label}`,
    template: `%s | ${name} Portfolio`,
  },
  description: summary,
  keywords: ['portfolio', 'backend engineer', 'golang', 'microservices', 'software engineer', name],
  authors: [{ name: name, url: url }],
  creator: name,
  publisher: name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: url,
    siteName: `${name} Portfolio`,
    title: `${name} Portfolio - ${label}`,
    description: summary,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} Portfolio - ${label}`,
    description: summary,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={theme}>
      <body className={`relative bg-skin-fill ${inter.className}`}>
        <div className="absolute top-0 -z-10 h-full w-full print:hidden">
          <div className="bg-skin-hue/10 absolute bottom-auto left-[20%] right-auto top-0 h-[200px] w-[200px] -translate-x-[30%] translate-y-[20%] rounded-full blur-[80px] invert-0 dark:bg-white/5"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
