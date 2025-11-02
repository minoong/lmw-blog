import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { ViewTransition } from 'react';

import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { basePath } from '@/lib/constants';
import TableOfContents from '@/components/mdx/TableOfContents';
import 'highlight.js/styles/github-dark.css';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <article className="max-w-3xl">
          <header className="mb-8">
            <ViewTransition name={`post-title-${slug}`}>
              <h1 className="mb-4 text-4xl font-bold dark:text-white">{post.title}</h1>
              <ViewTransition name={`post-date-${slug}`}>
                <div className="mb-4 flex items-center text-gray-600 dark:text-gray-400">
                  {post.category && (
                    <>
                      <span className="capitalize">{post.category}</span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <time>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
                </div>
              </ViewTransition>
            </ViewTransition>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeHighlight,
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'wrap',
                        properties: {
                          className: ['anchor-link'],
                        },
                      },
                    ],
                  ],
                },
              }}
              components={{
                img: (props) => {
                  const src = props.src || '';
                  const finalSrc = src.startsWith('/') ? `${basePath}${src}` : src;
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img {...props} src={finalSrc} alt={props.alt || ''} className="my-4 h-auto max-w-full rounded-lg" />;
                },
              }}
            />
          </div>
        </article>

        {/* Table of Contents - Desktop only */}
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
