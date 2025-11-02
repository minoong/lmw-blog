import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { ViewTransition } from 'react';

import { getWorkProject, getWorkProjects } from '@/lib/blog';
import { COMPANY_LOGOS } from '@/lib/constants';
import TableOfContents from '@/components/mdx/TableOfContents';
import 'highlight.js/styles/github-dark.css';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = getWorkProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);

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

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getWorkProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <article className="max-w-3xl">
          <header className="mb-8">
            <ViewTransition name={`project-title-${slug}`}>
              <h1 className="mb-4 text-4xl font-bold dark:text-white">{project.title}</h1>
            </ViewTransition>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {project.company && (
                <>
                  <ViewTransition name={`company-logo-${slug}`}>
                    {COMPANY_LOGOS[project.company] ? (
                      <div className="flex h-7 items-center rounded bg-gray-300 px-2.5 py-1 dark:bg-gray-700">
                        <Image src={COMPANY_LOGOS[project.company]} alt={project.company} width={70} height={24} className="h-5 w-auto object-contain" />
                      </div>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{project.company}</span>
                    )}
                  </ViewTransition>
                  <span className="text-gray-600 dark:text-gray-400">•</span>
                </>
              )}
              <ViewTransition name={`project-date-${slug}`}>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <time>{format(new Date(project.startDate), 'yyyy년 MM월')}</time>
                  <span>-</span>
                  {project.endDate ? <time>{format(new Date(project.endDate), 'yyyy년 MM월')}</time> : <span>진행중</span>}
                </div>
              </ViewTransition>
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
