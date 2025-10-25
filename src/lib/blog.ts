import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

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

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  github?: string;
  image?: string;
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

export function getProjects(): Project[] {
  const projectsDir = path.join(contentDirectory, 'projects');
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
