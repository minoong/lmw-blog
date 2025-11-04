import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

import { COMPANY_PRIORITY } from './constants';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  category?: string;
  content: string;
}

export interface ToyProject {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  github?: string;
  image?: string;
  content: string;
}

export interface WorkProject {
  slug: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  tags?: string[];
  company: string;
  order: number;
  content: string;
}

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => file.endsWith('.mdx'));
}

export function getBlogPosts(): Post[] {
  const blogDir = path.join(contentDirectory, 'blog');
  const files = getFiles(blogDir);

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const fullPath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        tags: data.tags || [],
        category: data.category || 'general',
        content,
      };
    })
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));

  return posts;
}

export function getBlogPost(slug: string): Post | null {
  const fullPath = path.join(contentDirectory, 'blog', `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    tags: data.tags || [],
    category: data.category || 'general',
    content,
  };
}

export function getToyProjects(): ToyProject[] {
  const projectsDir = path.join(contentDirectory, 'toy-projects');
  const files = getFiles(projectsDir);

  const projects = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(projectsDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      tags: data.tags || [],
      link: data.link || '',
      github: data.github || '',
      image: data.image || '',
      content,
    };
  });

  return projects;
}

export function getWorkProjects(): WorkProject[] {
  const projectsDir = path.join(contentDirectory, 'projects');
  const files = getFiles(projectsDir);

  const projects = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const fullPath = path.join(projectsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        startDate: data.startDate || new Date().toISOString(),
        endDate: data.endDate || '',
        description: data.description || '',
        tags: data.tags || [],
        company: data.company || '',
        order: data.order || 0,
        content,
      };
    })
    .sort((a, b) => {
      // 1. 회사 우선순위로 먼저 정렬
      const aPriority = COMPANY_PRIORITY[a.company] || 0;
      const bPriority = COMPANY_PRIORITY[b.company] || 0;
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // 2. 같은 회사 내에서 order 내림차순 (높은 숫자가 우선)
      return b.order - a.order;
    });

  return projects;
}

export function getWorkProject(slug: string): WorkProject | null {
  const fullPath = path.join(contentDirectory, 'projects', `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate || '',
    description: data.description || '',
    tags: data.tags || [],
    company: data.company || '',
    order: data.order || 0,
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getBlogPosts();
  return posts.filter((post) => post.tags?.includes(tag));
}

export function getAllCompanies(): string[] {
  const projects = getWorkProjects();
  const companies = new Set<string>();

  projects.forEach((project) => {
    if (project.company) {
      companies.add(project.company);
    }
  });

  return Array.from(companies).sort();
}

export function getWorkProjectsByCompany(company: string): WorkProject[] {
  const projects = getWorkProjects();
  return projects.filter((project) => project.company === company);
}

export function getAllProjectTags(): string[] {
  const workProjects = getWorkProjects();
  const toyProjects = getToyProjects();
  const tags = new Set<string>();

  workProjects.forEach((project) => {
    project.tags?.forEach((tag) => tags.add(tag));
  });

  toyProjects.forEach((project) => {
    project.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
