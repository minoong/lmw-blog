import fs from 'fs';
import path from 'path';

import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Download } from 'lucide-react';

import TableOfContents from '@/components/mdx/TableOfContents';
import 'highlight.js/styles/github-dark.css';
import { basePath } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Career',
  description: '경력 사항 및 업무 경험을 소개합니다.',
};

export default function CareerPage() {
  const contentPath = path.join(process.cwd(), 'src/content/career.mdx');
  const content = fs.readFileSync(contentPath, 'utf8');

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        <div className="lg:col-span-1">
          <div className="mb-8">
            <div className="flex items-center border-l-4 border-blue-500 bg-blue-50 p-2 dark:border-blue-400 dark:bg-gray-800">
              <div className="group ml-4 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">경력 기술서</p>
                <Link
                  href={`${basePath}/archive/프론트엔드_경력기술서_이민우.pdf`}
                  download="프론트엔드_경력기술서_이민우.pdf"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 underline group-hover:text-blue-900 dark:text-blue-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  .pdf 파일 다운로드
                </Link>
              </div>
            </div>
          </div>
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
        </div>

        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
