import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import createMDX from '@next/mdx';

// 개발 환경에서는 basePath 없이, 프로덕션(배포)에서는 /lmw-blog 사용
const isProd = process.env.NODE_ENV === 'production';
const basePathValue = isProd ? '/lmw-blog' : '';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: basePathValue,
  assetPrefix: basePathValue,
  trailingSlash: true,
  experimental: {
    viewTransition: true,
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

export default withSentryConfig(withMDX(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG,

  authToken: process.env.SENTRY_AUTH_TOKEN,

  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
