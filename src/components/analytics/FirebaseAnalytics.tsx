'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent } from 'firebase/analytics';

import { initAnalytics } from '@/lib/firebase';

export default function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const analytics = initAnalytics();

    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_search: searchParams?.toString(),
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
