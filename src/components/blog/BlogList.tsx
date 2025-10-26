'use client';

import { useState, useMemo, ViewTransition } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

import type { Post } from '@/lib/blog';

interface BlogListProps {
  posts: Post[];
  tags: string[];
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) => post.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  return (
    <>
      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold dark:text-white">Tags</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <ViewTransition key={post.slug} name={`post-card-${post.slug}`}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <ViewTransition name={`post-title-${post.slug}`}>
                  <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {post.title}
                  </h2>
                </ViewTransition>
                <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{post.description}</p>
                <ViewTransition name={`post-date-${post.slug}`}>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                    <time>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
                    {post.category && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{post.category}</span>
                      </>
                    )}
                  </div>
                </ViewTransition>
              </Link>
            </ViewTransition>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-gray-100 py-12 text-center dark:bg-gray-800">
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
            {selectedTag ? `"${selectedTag}" 태그의 포스트가 없습니다.` : '아직 작성된 포스트가 없습니다.'}
          </p>
          <p className="text-gray-400 dark:text-gray-500">
            <code className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">src/content/blog/</code> 폴더에 MDX 파일을 추가하여 포스트를 작성할 수 있습니다.
          </p>
        </div>
      )}
    </>
  );
}
