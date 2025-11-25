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
  title: 'About',
  description: '개발자 소개 페이지입니다.',
};

export default function AboutPage() {
  const contentPath = path.join(process.cwd(), 'src/content/about.mdx');
  const content = fs.readFileSync(contentPath, 'utf8');

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        <div className="lg:col-span-1">
          <div className="mb-8">
            <div className="dark:bg-claude-surface flex items-center border-l-4 border-blue-500 bg-blue-50 p-2 dark:border-blue-400">
              <div className="group ml-4 flex-1">
                <p className="dark:text-claude-text-secondary font-semibold text-gray-900">경력 기술서</p>
                <Link
                  href={`/archive/${process.env.NEXT_PUBLIC_LMW_PORTFOLIO}`}
                  download={process.env.NEXT_PUBLIC_LMW_PORTFOLIO}
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 underline group-hover:text-blue-500 dark:text-blue-400"
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
              components={{
                img: (props) => {
                  const src = props.src || '';
                  const finalSrc = src.startsWith('/') ? `${basePath}${src}` : src;
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img {...props} src={finalSrc} alt={props.alt || ''} className="my-4 h-auto w-[200px] max-w-full rounded-lg object-cover" />;
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
