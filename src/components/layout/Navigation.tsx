'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import HamburgerIcon from '@/components/layout/HamburgerIcon';
import MobileDrawer from '@/components/layout/MobileDrawer';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useSpyElem } from '@/lib/useSpyElem';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/career', label: 'Career' },
  { href: '/projects', label: 'Projects' },
  { href: '/toy-projects', label: 'Toy Projects' },
  { href: '/blog', label: 'Blog' },
];

// 네비게이션 높이 (h-16 = 64px)
const NAV_HEIGHT = 64;

export default function Navigation() {
  const pathname = usePathname();
  const { ref, marginTop } = useSpyElem({ elemHeight: NAV_HEIGHT, threshold: 15 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={ref}
        style={{ marginTop: `${marginTop}px` }}
        className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-md transition-[margin-top] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">이민우의 Tech Blog</span>
              </Link>
            </div>

            {/* 데스크톱 메뉴 (lg 이상에서만 표시) */}
            <div className="hidden items-center space-x-6 lg:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                    }`}
                  >
                    {item.label}
                    {isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-blue-600 to-purple-600" />}
                  </Link>
                );
              })}
              <ThemeToggle />
            </div>

            {/* 모바일 메뉴 버튼 (lg 미만에서만 표시) */}
            <div className="flex items-center space-x-4 lg:hidden">
              <ThemeToggle />
              <HamburgerIcon isOpen={isMobileMenuOpen} onClick={handleToggleMobileMenu} />
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 드로어 */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} navItems={navItems} />
    </>
  );
}
