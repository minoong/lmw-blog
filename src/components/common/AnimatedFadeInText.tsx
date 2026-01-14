'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

import { cn } from '@/lib/utils';

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface AnimatedFadeInTextProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

export default function AnimatedFadeInText({ children, as: Component = 'p', className, delay = 0 }: AnimatedFadeInTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated.current) return;

    gsap.set(textRef.current, { opacity: 0, y: 50 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            gsap.to(textRef.current, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              delay,
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(textRef.current);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <Component ref={textRef as React.RefObject<never>} className={cn('opacity-0', className)}>
      {children}
    </Component>
  );
}
