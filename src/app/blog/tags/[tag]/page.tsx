import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getPostsByTag, getAllTags } from '@/lib/blog';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} - Tech Blog`,
    description: `${tag} 태그가 붙은 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link href="/blog" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
          ← Back to Blog
        </Link>
        <h1 className="mb-2 text-4xl font-bold">#{tag}</h1>
        <p className="text-lg text-gray-600">{posts.length}개의 포스트</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
            <Link href={`/blog/${post.slug}`}>
              <div className="mb-2 flex flex-wrap gap-2">
                {post.tags?.map((postTag) => (
                  <span key={postTag} className={`rounded px-2 py-1 text-xs ${postTag === tag ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    {postTag}
                  </span>
                ))}
              </div>
              <h2 className="mb-2 text-2xl font-bold hover:text-blue-600">{post.title}</h2>
              <p className="mb-4 text-gray-600">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <time>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{post.category}</span>
                  </>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
