'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        variants={{
          initial: {
            opacity: 0,
            filter: 'blur(24px)',
            y: 10,
          },
          enter: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            },
          },
          exit: {
            opacity: 0,
            filter: 'blur(24px)',
            y: -10,
            transition: {
              duration: 0.3,
            },
          },
        }}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
