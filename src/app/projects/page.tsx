import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getWorkProjects, getAllCompanies, getAllProjectTags } from '@/lib/blog';
import ProjectList from '@/components/projects/ProjectList';
import ProjectTechStack from '@/components/projects/ProjectTechStack';
import AnimatedFadeInText from '@/components/common/AnimatedFadeInText';

export const metadata: Metadata = {
  title: 'Projects',
  description: '업무 프로젝트 및 경험을 소개합니다.',
};

export default function ProjectsPage() {
  const projects = getWorkProjects();
  const allCompanies = getAllCompanies();
  const tags = getAllProjectTags();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <AnimatedFadeInText as="h1" className="mb-4 text-4xl font-bold dark:text-white">
          Projects
        </AnimatedFadeInText>
        <AnimatedFadeInText as="p" className="text-lg text-gray-600 dark:text-gray-400" delay={0.3}>
          업무 프로젝트와 경험을 공유합니다.
        </AnimatedFadeInText>
      </div>

      <ProjectTechStack tags={tags} />

      <Suspense>
        <ProjectList projects={projects} companies={allCompanies} />
      </Suspense>
    </div>
  );
}
