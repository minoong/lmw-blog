'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PanInfo } from 'motion/react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

import ThemeToggle from '@/components/theme/ThemeToggle';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string }>;
}

const CLOSE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

export default function MobileDrawer({ isOpen, onClose, navItems }: MobileDrawerProps) {
  const pathname = usePathname();
  const y = useMotionValue(0);
  const drawerHeight = useMotionValue(0);

  const overlayOpacity = useTransform(y, [0, drawerHeight.get()], [0.5, 0]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    } else {
      document.body.style.overflow = 'unset';

      if (drawerHeight.get() > 0) {
        animate(y, drawerHeight.get(), { type: 'spring', stiffness: 300, damping: 30 });
      }
    }
  }, [isOpen, y, drawerHeight]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.y > CLOSE_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
      onClose();
    } else {
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div className="fixed inset-0 z-40 bg-black backdrop-blur-sm" style={{ opacity: overlayOpacity }} onClick={onClose} aria-hidden="true" />
      )}

      <motion.div
        ref={(el) => {
          if (el) drawerHeight.set(el.offsetHeight);
        }}
        className="dark:border-claude-border dark:bg-claude-bg fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        drag="y"
        dragConstraints={{ top: 0, bottom: drawerHeight.get() }}
        dragElastic={{ top: 0, bottom: 1 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex cursor-grab justify-center py-3 active:cursor-grabbing">
          <div className="dark:bg-claude-border h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <nav className="px-6 pt-4 pb-8">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'dark:bg-claude-surface bg-blue-50 text-blue-600 dark:text-blue-400'
                        : 'dark:hover:bg-claude-surface text-gray-700 hover:bg-gray-50 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="dark:border-claude-border mt-6 flex items-center justify-end border-t border-gray-200 pt-6">
            <ThemeToggle />
          </div>
        </nav>
      </motion.div>
    </>
  );
}
