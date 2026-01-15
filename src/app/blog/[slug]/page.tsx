import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

import { getBlogPost, getBlogPosts, getToyProject } from '@/lib/blog';
import { basePath } from '@/lib/constants';
import TableOfContents from '@/components/mdx/TableOfContents';
import ContentNavigation from '@/components/common/ContentNavigation';
import 'highlight.js/styles/github-dark.css';
import Mermaid from '@/components/mdx/Mermaid';

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
  const posts = getBlogPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];

  if (!post) {
    notFound();
  }

  const previousPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  // 연관된 토이프로젝트 가져오기
  const relatedProject = post.project ? getToyProject(post.project) : null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <article className="max-w-3xl">
          <header className="mb-8">
            {/* Related Project */}
            {relatedProject && (
              <div className="mb-6 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-950/30 dark:to-indigo-950/30">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>연관 토이프로젝트</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {relatedProject.github && (
                      <>
                        <a
                          href={relatedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <span className="text-sm">GitHub</span>
                        </a>
                        {relatedProject.links && relatedProject.links.length > 0 && <span className="text-gray-600 dark:text-gray-400">•</span>}
                      </>
                    )}
                    {relatedProject.links && relatedProject.links.length > 0 && (
                      <>
                        {relatedProject.links.map((link, index) => (
                          <span key={index} className="flex items-center gap-3">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative z-10 flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              <span className="text-sm">{link.label}</span>
                            </a>
                            {index < (relatedProject.links?.length ?? 0) - 1 && <span className="text-gray-600 dark:text-gray-400">•</span>}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <Link href={`/toy-projects/${relatedProject.slug}`} className="group flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {relatedProject.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{relatedProject.description}</p>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            <h1 className="mb-4 text-4xl font-bold dark:text-white">{post.title}</h1>

            <div className="mb-4 flex items-center text-gray-600 dark:text-gray-400">
              {post.category && (
                <>
                  <span className="capitalize">{post.category}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <time>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
            </div>

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
                pre: ({ children, ...props }) => {
                  if (children && typeof children === 'object' && 'props' in children) {
                    const codeProps = children.props;
                    const className = codeProps?.className || '';

                    if (className.includes('language-mermaid')) {
                      const code = codeProps.children;
                      if (typeof code === 'string') {
                        return <Mermaid chart={code.trim()} />;
                      }
                    }
                  }

                  return <pre {...props}>{children}</pre>;
                },
                a: (props) => {
                  const href = props.href || '';
                  const isExternal = href.startsWith('http');
                  const isAnchor = href.startsWith('#');
                  const finalHref = !isExternal && !isAnchor && href.startsWith('/') ? `${basePath}${href}` : href;
                  return <a {...props} href={finalHref} />;
                },
                img: (props) => {
                  const src = props.src || '';
                  const finalSrc = src.startsWith('/') ? `${basePath}${src}` : src;
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img {...props} src={finalSrc} alt={props.alt || ''} className="my-4 h-auto max-w-full rounded-lg" />;
                },
                source: (props) => {
                  const src = props.src || '';
                  const finalSrc = src.startsWith('/') ? `${basePath}${src}` : src;
                  return <source {...props} src={finalSrc} />;
                },
              }}
            />
          </div>
          <ContentNavigation basePath="/blog" previousPost={previousPost} nextPost={nextPost} />
        </article>

        {/* Table of Contents - Desktop only */}
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
