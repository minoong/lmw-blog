import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import FirebaseAnalytics from '@/components/analytics/FirebaseAnalytics';
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
  title: {
    template: '%s | 이민우의 Tech Blog',
    default: '이민우의 Tech Blog',
  },
  description: '개발자의 기술 블로그. 개발 경험, 프로젝트, 그리고 학습 내용을 공유합니다.',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark:bg-claude-bg dark:text-claude-text flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense>
            <FirebaseAnalytics />
          </Suspense>
          <Navigation />
          <main className="mx-auto w-full max-w-7xl grow px-4 pt-24 pb-8 sm:px-6 lg:px-8">{children}</main>
          <Footer />
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
