import Link from 'next/link';
import type { Metadata } from 'next';

import InteractivePDFViewer from '@/components/career/InteractivePDFViewer';
import AnimatedFadeInText from '@/components/common/AnimatedFadeInText';
import { basePath } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Career',
  description: '경력 사항 및 업무 경험을 소개합니다.',
};

export default function CareerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <AnimatedFadeInText as="h1" className="text-3xl font-bold tracking-tight sm:text-4xl">
          Career
        </AnimatedFadeInText>
        <AnimatedFadeInText as="p" className="text-muted-foreground mt-2" delay={0.3}>
          경력 사항 및 업무 경험을 소개합니다. 보다 자세한 프로젝트 히스토리는{' '}
          <Link href="/projects" className="text-primary font-medium hover:underline">
            Projects
          </Link>{' '}
          페이지를 참고해 주세요.
        </AnimatedFadeInText>
      </div>

      <InteractivePDFViewer fileUrl={`${basePath}/archive/career.pdf`} fileName="[프론트엔드_엔지니어]경력기술서_이민우.pdf" />
    </div>
  );
}
