'use client';

import Marquee from 'react-fast-marquee';

interface ProjectTechStackProps {
  tags: string[];
}

export default function ProjectTechStack({ tags }: ProjectTechStackProps) {
  const midPoint = Math.ceil(tags.length / 2);
  const topTags = tags.slice(0, midPoint);
  const bottomTags = tags.slice(midPoint);

  return (
    <section className="py-4">
      <div className="space-y-4">
        <Marquee speed={40} gradient={false}>
          {topTags.map((tag, index) => (
            <div
              key={`top-${tag}-${index}`}
              className="dark:border-claude-border dark:bg-claude-surface mx-2 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 dark:text-white"
            >
              <span className="font-semibold whitespace-nowrap">{tag}</span>
            </div>
          ))}
        </Marquee>

        <Marquee speed={40} gradient={false} direction="right">
          {bottomTags.map((tag, index) => (
            <div
              key={`bottom-${tag}-${index}`}
              className="dark:border-claude-border dark:bg-claude-surface mx-2 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 dark:text-white"
            >
              <span className="font-semibold whitespace-nowrap">{tag}</span>
            </div>
          ))}
        </Marquee>
      </div>

      <div className="mt-8 mb-8 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">프로젝트에서 사용한 기술 스택들입니다.</p>
      </div>
    </section>
  );
}
