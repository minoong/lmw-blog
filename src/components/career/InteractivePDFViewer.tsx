'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="my-16 flex h-[600px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-50 dark:bg-zinc-950">
      <div className="animate-pulse text-sm font-medium text-zinc-500">PDF 뷰어를 불러오는 중...</div>
    </div>
  ),
});

export default PDFViewer;
