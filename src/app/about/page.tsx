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
