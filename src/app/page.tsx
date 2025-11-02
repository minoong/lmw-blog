import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ViewTransition } from 'react';

import { getBlogPosts, getWorkProjects } from '@/lib/blog';
import { COMPANY_LOGOS } from '@/lib/constants';

export default function Home() {
  const recentPosts = getBlogPosts().slice(0, 3);
  const recentProjects = getWorkProjects().slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
          개발 경험과 학습 내용을 공유하는 기술 블로그입니다.
          <br />
          새로운 기술을 탐구하고 문제를 해결한 과정을 기록합니다.
        </p>
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold dark:text-white">Recent Posts</h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ViewTransition key={post.slug} name={`post-card-${post.slug}`}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group dark:border-claude-border dark:bg-claude-surface block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ViewTransition name={`post-title-${post.slug}`}>
                    <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                  </ViewTransition>
                  <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{post.description}</p>
                  <ViewTransition name={`post-date-${post.slug}`}>
                    <time className="text-sm text-gray-500 dark:text-gray-500">{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
                  </ViewTransition>
                </Link>
              </ViewTransition>
            ))}
          </div>
        ) : (
          <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
            <p className="animate-bounce text-gray-500 dark:text-gray-400">아직 작성된 포스트가 없습니다.</p>
          </div>
        )}
      </section>

      {/* Recent Projects Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold dark:text-white">Featured Projects</h2>
          <Link
            href="/projects"
            className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ViewTransition key={project.slug} name={`project-card-${project.slug}`}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group dark:border-claude-border dark:bg-claude-surface block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <ViewTransition name={`company-logo-${project.slug}`}>
                      {project.company && COMPANY_LOGOS[project.company] ? (
                        <div className="dark:bg-claude-border flex h-6 items-center rounded bg-gray-300 px-2 py-1">
                          <Image src={COMPANY_LOGOS[project.company]} alt={project.company} width={60} height={20} className="h-4 w-auto object-contain" />
                        </div>
                      ) : project.company ? (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {project.company}
                        </span>
                      ) : null}
                    </ViewTransition>
                    <ViewTransition name={`project-date-${project.slug}`}>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <time>{format(new Date(project.startDate), 'yyyy.MM')}</time>
                        <span>-</span>
                        {project.endDate ? <time>{format(new Date(project.endDate), 'yyyy.MM')}</time> : <span>진행중</span>}
                      </div>
                    </ViewTransition>
                  </div>
                  <ViewTransition name={`project-title-${project.slug}`}>
                    <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {project.title}
                    </h3>
                  </ViewTransition>
                  <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{project.description}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="dark:bg-claude-border rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </ViewTransition>
            ))}
          </div>
        ) : (
          <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
            <p className="animate-bounce text-gray-500 dark:text-gray-400">아직 등록된 프로젝트가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
