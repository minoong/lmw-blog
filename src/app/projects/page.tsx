import type { Metadata } from 'next';
import { ViewTransition } from 'react';

import { getWorkProjects, getAllCompanies, getAllProjectTags } from '@/lib/blog';
import ProjectList from '@/components/projects/ProjectList';
import ProjectTechStack from '@/components/projects/ProjectTechStack';

export const metadata: Metadata = {
  title: 'Projects',
  description: '업무 프로젝트 및 경험을 소개합니다.',
};

export default function ProjectsPage() {
  const projects = getWorkProjects();
  const allCompanies = getAllCompanies();
  const tags = getAllProjectTags();

  return (
    <ViewTransition>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold dark:text-white">Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">업무 프로젝트와 경험을 공유합니다.</p>
        </div>

        <ProjectTechStack tags={tags} />

        <ProjectList projects={projects} companies={allCompanies} />
      </div>
    </ViewTransition>
  );
}
