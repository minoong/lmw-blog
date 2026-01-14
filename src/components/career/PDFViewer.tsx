'use client';

import React, { useState, useMemo } from 'react';
import { FileText, ExternalLink, FileDown, ZoomIn, ZoomOut, RotateCcw, Maximize, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

export default function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pageRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageIndex = entry.target.getAttribute('data-page-index');
          if (pageIndex) {
            setCurrentPage(parseInt(pageIndex, 10));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const currentRefs = pageRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('resize', updateWidth);
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1.0);
  const handleFit = () => setScale(1.0);

  const pageWidth = useMemo(() => {
    const padding = 64;
    const baseWidth = containerWidth > 0 ? Math.min(containerWidth - padding, 800) : 800;
    return baseWidth * scale;
  }, [containerWidth, scale]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="group relative my-16 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-50 shadow-2xl dark:bg-zinc-950"
    >
      <div className="relative z-50 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-200 bg-white/90 px-8 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-black/40">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-[10px] font-black tracking-widest text-transparent uppercase">
              이민우 경력기술서
            </span>
            <h3 className="max-w-[140px] truncate text-base font-bold text-zinc-800 sm:max-w-md dark:text-zinc-100">{fileName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <a href={fileUrl} download={fileName} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">저장</span>
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="rounded-xl dark:border-zinc-700">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="custom-pdf-scrollbar relative h-[550px] w-full overflow-auto bg-zinc-100/50 sm:h-[800px] dark:bg-zinc-950/40" ref={containerRef}>
        <div className="pointer-events-none sticky top-6 bottom-8 z-50 flex justify-center px-4 sm:bottom-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.9 }}
            animate={{ scale: 0.8, opacity: 0.9 }}
            whileHover={{
              scale: 1,
              opacity: 1,
              transition: { type: 'spring', stiffness: 350, damping: 25 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-white/20 bg-zinc-900/95 p-2 shadow-2xl transition-colors hover:bg-zinc-900 sm:gap-1.5"
          >
            <div className="mr-1 flex items-center gap-2 border-r border-white/10 px-3 text-[10px] font-bold text-white/90 tabular-nums sm:text-[11px]">
              <span className="text-blue-400">{currentPage}</span>
              <span className="text-[9px] text-white/30">/</span>
              <span className="text-white/50">{numPages || '..'}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomIn}
              className="cursor-pointer p-2 text-white/80 transition-colors hover:text-white"
              title="확대"
            >
              <ZoomIn className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomOut}
              className="cursor-pointer p-2 text-white/70 transition-colors hover:text-white"
              title="축소"
            >
              <ZoomOut className="h-5 w-5" />
            </motion.button>
            <div className="mx-1 h-5 w-px bg-white/20" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className="cursor-pointer p-2 text-white/70 transition-colors hover:text-white"
              title="되돌림"
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFit}
              className="cursor-pointer p-2 text-white/70 transition-colors hover:text-white"
              title="사이즈 딱 맞춤"
            >
              <Maximize className="h-5 w-5" />
            </motion.button>
            <div className="mx-2 min-w-[32px] text-center text-[10px] font-bold text-white/60 tabular-nums">{Math.round(scale * 100)}%</div>
          </motion.div>
        </div>

        <div className="flex min-h-full flex-col items-center px-4 py-8 sm:px-8 sm:py-12">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex h-[400px] flex-col items-center justify-center gap-4 sm:h-[600px]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="px-4 text-center text-sm font-medium tracking-tight text-zinc-500">PDF 문서를 렌더링 중입니다...</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => {
                  pageRefs.current[index] = el;
                }}
                data-page-index={index + 1}
                className="mb-6 shadow-xl transition-all duration-300 last:mb-0 sm:mb-10 sm:shadow-2xl"
              >
                <Page pageNumber={index + 1} width={pageWidth} renderAnnotationLayer={true} renderTextLayer={true} className="bg-white" />
              </div>
            ))}
          </Document>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white px-6 py-3 sm:px-8 dark:border-white/5 dark:bg-zinc-900/30">
        <div className="flex flex-col items-center justify-between gap-2 text-[10px] font-medium text-zinc-500 sm:flex-row sm:text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              {numPages} Pages
            </span>
            <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="font-semibold whitespace-nowrap text-zinc-400">이민우 경력기술서 PDF</span>
          </div>
          <p className="text-center tracking-tighter uppercase opacity-80 sm:text-right">최신 버전</p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-pdf-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-pdf-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-pdf-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0, 0, 0, 0.1); 
          border-radius: 10px; 
          border: 2px solid transparent; 
          background-clip: content-box; 
        }
        .dark .custom-pdf-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); background-clip: content-box; }
        .react-pdf__Page__annotations.annotationLayer { z-index: 3 !important; }
        .react-pdf__Page__annotations.annotationLayer a { cursor: pointer !important; }
      `,
        }}
      />
    </motion.div>
  );
}
