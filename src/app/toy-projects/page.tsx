import type { Metadata } from 'next';

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
        <p className="text-lg text-gray-600 dark:text-gray-400">개인적으로 진행한 사이드 프로젝트와 작업물들을 소개합니다.</p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="dark:border-claude-border dark:bg-claude-surface rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-2xl font-bold dark:text-white">{project.title}</h2>
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Live Demo →
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
