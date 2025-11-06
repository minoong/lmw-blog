import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

import { getBlogPosts, getWorkProjects, getToyProjects } from '@/lib/blog';
import { COMPANY_LOGOS } from '@/lib/constants';

export default function Home() {
  const recentPosts = getBlogPosts().slice(0, 3);
  const recentProjects = getWorkProjects().slice(0, 3);
  const recentToyProjects = getToyProjects().slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
          안녕하세요, 프론트엔드 개발자 이민우입니다.
          <br />
          저의 소개, 경력사항, 경력기술서 그리고 토이 프로젝트 내용을 소개합니다.
        </p>
      </section>

      {/* Recent Projects Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold dark:text-white">Projects</h2>
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
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group dark:border-claude-border dark:bg-claude-surface block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  {project.company && COMPANY_LOGOS[project.company] ? (
                    <div className="dark:bg-claude-border flex h-6 items-center rounded bg-gray-300 px-2 py-1">
                      <Image src={COMPANY_LOGOS[project.company]} alt={project.company} width={60} height={20} className="h-4 w-auto object-contain" />
                    </div>
                  ) : project.company ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {project.company}
                    </span>
                  ) : null}

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <time>{format(new Date(project.startDate), 'yyyy.MM')}</time>
                    <span>-</span>
                    {project.endDate ? <time>{format(new Date(project.endDate), 'yyyy.MM')}</time> : <span>진행중</span>}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {project.title}
                </h3>

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
            ))}
          </div>
        ) : (
          <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
            <p className="animate-bounce text-gray-500 dark:text-gray-400">아직 등록된 프로젝트가 없습니다.</p>
          </div>
        )}
      </section>

      {/* Toy Projects Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold dark:text-white">Toy Projects</h2>
          <Link
            href="/toy-projects"
            className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {recentToyProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentToyProjects.map((project) => (
              <div
                key={project.slug}
                className="group dark:border-claude-border dark:bg-claude-surface rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold dark:text-white">{project.title}</h3>

                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        aria-label="GitHub"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="dark:bg-claude-border rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="dark:bg-claude-border rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
            <p className="animate-bounce text-gray-500 dark:text-gray-400">아직 등록된 토이 프로젝트가 없습니다.</p>
          </div>
        )}
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
              <Link
                key={post.slug}
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

                <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {post.title}
                </h3>

                <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{post.description}</p>

                <time className="text-sm text-gray-500 dark:text-gray-500">{format(new Date(post.date), 'yyyy년 MM월 dd일')}</time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
            <p className="animate-bounce text-gray-500 dark:text-gray-400">아직 작성된 포스트가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
