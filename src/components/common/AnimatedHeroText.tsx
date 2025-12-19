'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

import { cn } from '@/lib/utils';

interface AnimatedHeroTextProps {
  lines: string[];
  className?: string;
}

export default function AnimatedHeroText({ lines, className = '' }: AnimatedHeroTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-2', className)}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        const baseDelay = lineIndex * words.length;

        return (
          <div key={lineIndex} className="flex flex-wrap justify-center gap-x-2">
            {words.map((word, wordIndex) => (
              <motion.span
                key={`${lineIndex}-${wordIndex}`}
                variants={pullupVariant}
                initial="initial"
                animate={isInView ? 'animate' : 'initial'}
                custom={baseDelay + wordIndex}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
