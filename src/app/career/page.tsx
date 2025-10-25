import fs from 'fs';
import path from 'path';

import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

import TableOfContents from '@/components/mdx/TableOfContents';
import 'highlight.js/styles/github-dark.css';

export const metadata: Metadata = {
  title: 'Career - Tech Blog',
  description: '경력 사항 및 업무 경험을 소개합니다.',
};

export default function CareerPage() {
  const contentPath = path.join(process.cwd(), 'src/content/career.mdx');
  const content = fs.readFileSync(contentPath, 'utf8');

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        <article className="prose prose-lg max-w-3xl">
          <MDXRemote
            source={content}
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
        </article>

        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
