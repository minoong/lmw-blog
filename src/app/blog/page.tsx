import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { getBlogPosts, getAllTags } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Tech Blog',
  description: '기술 블로그 포스트 목록입니다.',
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const allTags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold dark:text-white">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">개발 경험과 학습한 내용을 공유합니다.</p>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold dark:text-white">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
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
              <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                <time>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{post.category}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-gray-100 py-12 text-center dark:bg-gray-800">
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">아직 작성된 포스트가 없습니다.</p>
          <p className="text-gray-400 dark:text-gray-500">
            <code className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">src/content/blog/</code> 폴더에 MDX 파일을 추가하여 포스트를 작성할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
