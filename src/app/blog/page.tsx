import type { Metadata } from 'next';

import { getBlogPosts, getAllTags } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'Blog',
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

      <BlogList posts={posts} tags={allTags} />
    </div>
  );
}
