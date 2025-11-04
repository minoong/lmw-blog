import type { Metadata } from 'next';
import { ViewTransition } from 'react';

import { getToyProjects } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Toy Projects',
  description: '사이드 프로젝트와 개인 작업물을 소개합니다.',
};

export default function ToyProjectsPage() {
  const projects = getToyProjects();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold dark:text-white">Toy Projects</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">진행한 토이 프로젝트들을 소개합니다.</p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project) => (
            <ViewTransition key={project.slug} name={`toy-project-card-${project.slug}`}>
              <div className="dark:border-claude-border dark:bg-claude-surface group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <ViewTransition name={`toy-project-title-${project.slug}`}>
                    <h2 className="text-2xl font-bold dark:text-white">{project.title}</h2>
                  </ViewTransition>
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

                <p className="mb-4 text-gray-700 dark:text-gray-400">{project.description}</p>

                {project.tags && project.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose max-w-none text-gray-600 dark:text-gray-400">{project.content.split('\n').slice(0, 3).join('\n')}</div>
              </div>
            </ViewTransition>
          ))}
        </div>
      ) : (
        <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
          <p className="mb-4 animate-bounce text-lg text-gray-500 dark:text-gray-400">아직 등록된 프로젝트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
