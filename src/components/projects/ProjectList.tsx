'use client';

import { useMemo, ViewTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { WorkProject } from '@/lib/blog';
import { COMPANY_LOGOS, COMPANY_PRIORITY } from '@/lib/constants';

interface ProjectListProps {
  projects: WorkProject[];
  companies: string[];
}

interface GroupedProjects {
  company: string;
  projects: WorkProject[];
}

export default function ProjectList({ projects, companies }: ProjectListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCompany = searchParams.get('company');

  const filteredProjects = useMemo(() => {
    if (!selectedCompany) return projects;
    return projects.filter((project) => project.company === selectedCompany);
  }, [projects, selectedCompany]);

  // company별로 그룹화
  const groupedProjects = useMemo(() => {
    const groups: GroupedProjects[] = [];
    let currentCompany = '';

    filteredProjects.forEach((project) => {
      if (project.company !== currentCompany) {
        currentCompany = project.company;
        groups.push({
          company: currentCompany,
          projects: [project],
        });
      } else {
        groups[groups.length - 1].projects.push(project);
      }
    });

    return groups;
  }, [filteredProjects]);

  // Sort companies by COMPANY_PRIORITY (highest first)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const aPriority = COMPANY_PRIORITY[a] || 0;
      const bPriority = COMPANY_PRIORITY[b] || 0;
      return bPriority - aPriority;
    });
  }, [companies]);

  const handleCompanyClick = (company: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (company) {
      params.set('company', company);
    } else {
      params.delete('company');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* Companies */}
      {companies.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold dark:text-white">Companies</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCompanyClick(null)}
              className={`cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                selectedCompany === null
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'dark:bg-claude-surface dark:hover:bg-claude-border bg-gray-100 text-gray-700 hover:bg-gray-200 dark:text-gray-300'
              }`}
            >
              All
            </button>
            {sortedCompanies.map((company) => (
              <button
                key={company}
                onClick={() => handleCompanyClick(company)}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  selectedCompany === company
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-blue-100 text-gray-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-gray-300 dark:hover:bg-blue-900/50'
                }`}
              >
                {COMPANY_LOGOS[company] && (
                  <>
                    <div className="flex h-4 items-center rounded bg-gray-300 px-1.5 py-0.5 dark:bg-gray-700">
                      <Image src={COMPANY_LOGOS[company]} alt={company} width={40} height={14} className="h-3 w-auto object-contain" />
                    </div>
                    <span>•</span>
                  </>
                )}
                {company}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-12">
          {groupedProjects.map((group, index) => (
            <div key={group.company + index}>
              {/* Company Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {COMPANY_LOGOS[group.company] && (
                    <div className="dark:bg-claude-border flex h-8 items-center rounded bg-gray-300 px-3 py-1.5 shadow-sm">
                      <Image src={COMPANY_LOGOS[group.company]} alt={group.company} width={80} height={28} className="h-6 w-auto object-contain" />
                    </div>
                  )}
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-300 to-transparent dark:from-gray-700" />
              </div>

              {/* Company Projects */}
              <div className="space-y-6">
                {group.projects.map((project) => (
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
                          ) : (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {project.company}
                            </span>
                          )}
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
                        <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {project.title}
                        </h2>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="dark:bg-claude-surface rounded-xl bg-gray-100 py-12 text-center">
          <p className="mb-4 animate-bounce text-lg text-gray-500 dark:text-gray-400">
            {selectedCompany ? `${selectedCompany}의 프로젝트가 없습니다.` : '아직 등록된 프로젝트가 없습니다.'}
          </p>
        </div>
      )}
    </>
  );
}
