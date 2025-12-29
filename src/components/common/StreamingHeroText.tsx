'use client';

import { useEffect, useState } from 'react';
import { Streamdown } from 'streamdown';

interface StreamingHeroTextProps {
  lines: string[];
  className?: string;
  streamingSpeed?: number;
}

export default function StreamingHeroText({ lines, className = '', streamingSpeed = 20 }: StreamingHeroTextProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsStreaming(false);
      return;
    }

    let currentIndex = 0;
    const currentLine = lines[currentLineIndex];
    setIsStreaming(true);
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIndex <= currentLine.length) {
        setDisplayedText(currentLine.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCompletedLines((prev) => [...prev, currentLine]);
          setCurrentLineIndex((prev) => prev + 1);
        }, 500);
      }
    }, streamingSpeed);

    return () => clearInterval(interval);
  }, [currentLineIndex, lines, streamingSpeed]);

  return (
    <div className={className}>
      {completedLines.map((line, index) => (
        <div key={`completed-${index}`} className={index > 0 ? 'mt-4' : ''}>
          <div className="flex items-start justify-center gap-2">
            <Streamdown>{line}</Streamdown>
            {currentLineIndex >= lines.length && index === completedLines.length - 1 && (
              <div className="pointer-events-none relative mt-1 flex shrink-0 items-center justify-center">
                <svg className="h-6 w-6 animate-pulse text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                <span
                  className="absolute -right-8 rounded bg-linear-to-r from-blue-500 to-purple-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm"
                  style={{ transform: 'rotate(30deg)', transformOrigin: 'center right' }}
                >
                  Streamdown
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <div className={completedLines.length > 0 ? 'mt-4' : ''}>
          <div className="flex items-start justify-center gap-2">
            <Streamdown isAnimating={isStreaming}>{displayedText}</Streamdown>
            <div className="pointer-events-none relative mt-1 flex shrink-0 items-center justify-center">
              <svg className="h-6 w-6 animate-pulse text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
              <span
                className="absolute -right-8 rounded bg-linear-to-r from-blue-500 to-purple-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm"
                style={{ transform: 'rotate(30deg)', transformOrigin: 'center right' }}
              >
                Streamdown
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
