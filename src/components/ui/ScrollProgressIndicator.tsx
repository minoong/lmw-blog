'use client';

import { motion, useScroll } from 'motion/react';

export default function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <div className="fixed top-16 right-0 left-0 z-40 h-1 bg-gray-200 dark:bg-gray-800" />

      <motion.div
        className="fixed top-16 right-0 left-0 z-40 h-1 origin-left bg-linear-to-r from-blue-600 to-purple-600"
        style={{
          scaleX: scrollYProgress,
        }}
      />
    </>
  );
}
