'use client';

import Link from 'next/link';

interface NavItem {
  slug: string;
  title: string;
}

interface ContentNavigationProps {
  basePath: string;
  previousPost: NavItem | null;
  nextPost: NavItem | null;
}

export default function ContentNavigation({ basePath, previousPost, nextPost }: ContentNavigationProps) {
  return (
    <div className="mt-12 flex gap-4 border-t pt-8 dark:border-gray-700">
      <div className="group flex-1">
        {previousPost ? (
          <Link
            href={`${basePath}/${previousPost.slug}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-lg border p-4 text-left transition-colors ease-in-out hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">이전글</p>
            <p className="mt-1 line-clamp-2 font-semibold group-hover:underline">{previousPost.title}</p>

            <span className="absolute inset-0 flex size-full transform-[skew(-14deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-14deg)_translateX(100%)] group-hover:duration-700">
              <span className="relative h-full w-32 bg-black/10 dark:bg-white/20" />
            </span>
          </Link>
        ) : (
          <div className="flex h-full flex-col rounded-lg border p-4 text-left dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">이전글</p>
            <p className="mt-1 font-semibold">이전글이 없습니다.</p>
          </div>
        )}
      </div>
      <div className="group flex-1">
        {nextPost ? (
          <Link
            href={`${basePath}/${nextPost.slug}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-lg border p-4 text-right transition-colors ease-in-out hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">다음글</p>
            <p className="mt-1 line-clamp-2 font-semibold group-hover:underline">{nextPost.title}</p>

            <span className="absolute inset-0 flex size-full transform-[skew(-14deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-14deg)_translateX(100%)] group-hover:duration-700">
              <span className="relative h-full w-32 bg-black/10 dark:bg-white/20" />
            </span>
          </Link>
        ) : (
          <div className="flex h-full flex-col rounded-lg border p-4 text-right dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">다음글</p>
            <p className="mt-1 font-semibold">다음글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
