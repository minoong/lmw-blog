'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const levelToPadding: { [key: number]: string } = {
  2: 'pl-3',
  3: 'pl-6',
  4: 'pl-9',
};

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [ancestorIds, setAncestorIds] = useState<string[]>([]);
  const tocRef = useRef<HTMLElement>(null);
  const headingsRef = useRef<HTMLElement[]>([]);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    headingsRef.current = Array.from(document.querySelectorAll('article h2, article h3, article h4'));

    const items: TOCItem[] = headingsRef.current.map((heading) => ({
      id: heading.id,
      title: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    }));
    setToc(items);

    const findBestCandidate = () => {
      const topOffset = 120;
      let bestCandidateId = '';

      headingsRef.current.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= topOffset) {
          bestCandidateId = heading.id;
        }
      });

      if (!bestCandidateId && headingsRef.current.length > 0) {
        bestCandidateId = headingsRef.current[0].id;
      }

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        const lastHeading = headingsRef.current[headingsRef.current.length - 1];
        if (lastHeading) {
          bestCandidateId = lastHeading.id;
        }
      }

      setActiveId(bestCandidateId);
    };

    const handleScroll = () => {
      if (throttleTimer.current) return;
      throttleTimer.current = setTimeout(() => {
        findBestCandidate();
        throttleTimer.current = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    findBestCandidate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;

    if (tocRef.current) {
      const activeLink = tocRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }

    const activeIndex = toc.findIndex((item) => item.id === activeId);
    if (activeIndex === -1) return;

    const newAncestorIds: string[] = [];
    let currentLevel = toc[activeIndex].level;

    for (let i = activeIndex - 1; i >= 0; i--) {
      if (toc[i].level < currentLevel) {
        newAncestorIds.push(toc[i].id);
        currentLevel = toc[i].level;
        if (currentLevel === 2) break;
      }
    }
    setAncestorIds(newAncestorIds);
  }, [activeId, toc]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    history.pushState(null, '', `#${id}`);
  };

  if (toc.length === 0) return null;

  return (
    <nav
      ref={tocRef}
      className="dark:bg-claude-surface sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto rounded-lg bg-gray-50 p-4 shadow-sm dark:shadow-lg"
    >
      <ul className="space-y-1 text-sm">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          const isAncestor = ancestorIds.includes(item.id);

          let itemClasses = `block rounded-md px-3 py-1.5 transition-colors duration-200 ease-in-out ${levelToPadding[item.level] || 'pl-0'}`;

          if (isActive) {
            itemClasses += ' bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
          } else if (isAncestor) {
            itemClasses += ' text-blue-600 dark:text-blue-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50';
          } else {
            itemClasses += ' text-gray-600 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-700/50';
          }

          if (item.level === 2) {
            itemClasses += ' font-bold';
          }

          return (
            <li key={item.id}>
              <Link href={`#${item.id}`} className={itemClasses.trim()} onClick={(e) => handleLinkClick(e, item.id)}>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
