'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useTheme } from 'next-themes';

type MermaidProps = {
  chart: string;
};

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const isDarkMode = resolvedTheme === 'dark';

    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const render = async () => {
      if (ref.current) {
        try {
          const id = `mermaid-${Date.now()}`;
          const { svg } = await mermaid.render(id, chart);

          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };

    render();
  }, [chart, resolvedTheme]);

  return (
    <div className="relative my-8">
      <TransformWrapper initialScale={1} minScale={0.5} maxScale={3} centerOnInit wheel={{ step: 0.1 }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button
                onClick={() => zoomIn()}
                className="cursor-pointer rounded-lg bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label="확대"
                title="확대"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => zoomOut()}
                className="cursor-pointer rounded-lg bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label="축소"
                title="축소"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => resetTransform()}
                className="cursor-pointer rounded-lg bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label="초기화"
                title="원래 크기로"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <TransformComponent wrapperClass="!w-full" contentClass="flex justify-center">
              <div ref={ref} className="mermaid" />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* 안내 메시지 */}
      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">드래그로 이동 | 마우스 휠로 확대/축소</div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Mermaid 컴포넌트는 직접 구현하였습니다.(Blog 참고, 작성중)</span>
      </div>
    </div>
  );
}
