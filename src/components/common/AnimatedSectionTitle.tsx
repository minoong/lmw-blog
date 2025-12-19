'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { cn } from '@/lib/utils';

gsap.registerPlugin(SplitText);

interface AnimatedSectionTitleProps {
  children: string;
  className?: string;
}

export default function AnimatedSectionTitle({ children, className }: AnimatedSectionTitleProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated.current) return;

    gsap.set(textRef.current, { opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            gsap.set(textRef.current, { opacity: 1 });

            splitRef.current = SplitText.create(textRef.current, {
              type: 'lines',
            });

            // 분할된 라인들의 초기 상태 설정
            gsap.set(splitRef.current.lines, {
              rotationX: -120,
              transformOrigin: '50% 100% -50px',
              opacity: 0,
              scale: 0.5,
              y: 50,
            });

            gsap.to(splitRef.current.lines, {
              rotationX: 0,
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: 'power4',
              stagger: 0.2,
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(textRef.current);

    return () => {
      observer.disconnect();
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, []);

  return (
    <h2 ref={textRef} className={cn('text-3xl font-bold opacity-0 dark:text-white', className)} style={{ perspective: '500px' }}>
      {children}
    </h2>
  );
}
