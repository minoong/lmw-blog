import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

// 개발 환경에서는 basePath 없이, 프로덕션(배포)에서는 /lmw-blog 사용
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/lmw-blog' : '',
  trailingSlash: true,
  experimental: {
    viewTransition: true,
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      'rehype-slug',
      'rehype-highlight',
      [
        'rehype-autolink-headings',
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor-link'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
