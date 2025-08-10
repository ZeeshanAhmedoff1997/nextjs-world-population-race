import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'World Population Race',
  description:
    'Interactive visualization of world population growth across countries over time as a bar chart race.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'World Population Race',
    description:
      'Explore the rise and fall of populations with an animated bar chart race.',
    images: [
      {
        url: '/og-world-population-race.svg',
        width: 1200,
        height: 630,
        alt: 'World Population Race',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Population Race',
    description:
      'Interactive visualization of world population growth over time.',
    images: ['/og-world-population-race.svg'],
  },
  keywords: [
    'world population',
    'bar chart race',
    'data visualization',
    'interactive chart',
    'countries population',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
