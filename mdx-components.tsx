import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';

import Mermaid from '@/components/mdx/Mermaid';
import { basePath } from '@/lib/constants';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, id }) => (
      <h1 id={id} className="mt-8 mb-4 scroll-mt-20 text-4xl font-bold">
        {children}
      </h1>
    ),
    h2: ({ children, id }) => (
      <h2 id={id} className="mt-6 mb-3 scroll-mt-20 text-3xl font-semibold">
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} className="mt-4 mb-2 scroll-mt-20 text-2xl font-semibold">
        {children}
      </h3>
    ),
    h4: ({ children, id }) => (
      <h4 id={id} className="mt-3 mb-2 scroll-mt-20 text-xl font-semibold">
        {children}
      </h4>
    ),
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="mb-4 list-inside list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="mb-4 list-inside list-decimal space-y-2">{children}</ol>,
    li: ({ children }) => <li className="ml-4">{children}</li>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      const isAnchor = href?.startsWith('#');

      if (isAnchor) {
        return (
          <a href={href} className="scroll-smooth text-blue-600 underline hover:text-blue-800">
            {children}
          </a>
        );
      }

      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
            {children}
          </a>
        );
      }

      return (
        <Link href={href || '#'} className="text-blue-600 underline hover:text-blue-800">
          {children}
        </Link>
      );
    },
    img: (props) => {
      const src = props.src || '';
      const finalSrc = src.startsWith('/') ? `${basePath}${src}` : src;
      return <Image {...props} src={finalSrc} alt={props.alt || ''} width={800} height={400} className="my-4 rounded-lg" />;
    },
    blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic">{children}</blockquote>,
    code: ({ children, className }) => {
      const language = className?.replace('language-', '');

      if (language === 'mermaid' && typeof children === 'string') {
        return <Mermaid chart={children} />;
      }

      return <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">{children}</code>;
    },
    pre: ({ children }) => {
      if (children && typeof children === 'object' && 'props' in children) {
        const codeProps = children.props;
        const className = codeProps.className;
        const language = className?.replace('language-', '');

        if (language === 'mermaid' && typeof codeProps.children === 'string') {
          return <Mermaid chart={codeProps.children} />;
        }
      }

      return <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">{children}</pre>;
    },
    hr: () => <hr className="my-8 border-gray-300" />,
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="bg-gray-50 px-3 py-2 text-left text-sm font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-t border-gray-200 px-3 py-2 text-sm">{children}</td>,
    ...components,
  };
}
