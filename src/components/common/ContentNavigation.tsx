'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

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
          <Button variant="outline" className="h-auto w-full justify-start p-4 text-left" asChild>
            <Link href={`${basePath}/${previousPost.slug}`}>
              <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">이전글</p>
                <p className="mt-1 line-clamp-2 font-semibold group-hover:underline">{previousPost.title}</p>
              </div>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="h-auto w-full justify-start p-4 text-left" disabled>
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">이전글</p>
              <p className="mt-1 font-semibold">이전글이 없습니다.</p>
            </div>
          </Button>
        )}
      </div>
      <div className="group flex-1">
        {nextPost ? (
          <Button variant="outline" className="h-auto w-full justify-end p-4 text-right" asChild>
            <Link href={`${basePath}/${nextPost.slug}`}>
              <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">다음글</p>
                <p className="mt-1 line-clamp-2 font-semibold group-hover:underline">{nextPost.title}</p>
              </div>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="h-auto w-full justify-end p-4 text-right" disabled>
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">다음글</p>
              <p className="mt-1 font-semibold">다음글이 없습니다.</p>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
