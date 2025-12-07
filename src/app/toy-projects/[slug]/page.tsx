import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

import { getToyProject, getToyProjects, getBlogPost } from '@/lib/blog';
import { basePath } from '@/lib/constants';
import Mermaid from '@/components/mdx/Mermaid';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = getToyProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getToyProject(slug);

  if (!project) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ToyProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getToyProject(slug);

  if (!project) {
    notFound();
  }

  // relatedPosts에 명시된 블로그 포스트들 가져오기
  const relatedPosts = project.relatedPosts?.map((postSlug) => getBlogPost(postSlug)).filter((post) => post !== null) || [];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <article className="max-w-3xl">
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold dark:text-white">{project.title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              {project.github && (
                <>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                  {project.links && project.links.length > 0 && <span className="text-gray-600 dark:text-gray-400">•</span>}
                </>
              )}
              {project.links && project.links.length > 0 && (
                <>
                  {project.links.map((link, index) => (
                    <span key={index} className="flex items-center gap-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
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
                      {index < (project.links?.length ?? 0) - 1 && <span className="text-gray-600 dark:text-gray-400">•</span>}
                    </span>
                  ))}
                </>
              )}
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote
              source={project.content}
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
              }}
            />
          </div>

          {/* Related Blog Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="mb-6 text-2xl font-bold dark:text-white">관련 블로그 포스트</h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="dark:border-claude-border dark:bg-claude-surface group block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    {post.description && <p className="text-sm text-gray-600 dark:text-gray-400">{post.description}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
