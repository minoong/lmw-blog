# Tech Blog

Next.js 16과 MDX를 활용한 개인 기술 블로그입니다. Nextra 블로그 테마의 컨셉을 참고하여 구현했습니다.

## 주요 기능

- **MDX 기반 콘텐츠**: 마크다운으로 간편하게 블로그 포스트 작성
- **자기소개 페이지**: 개인 정보 및 기술 스택 소개
- **경력 사항**: 업무 경험 및 학력 정보
- **프로젝트 쇼케이스**: 사이드 프로젝트 소개
- **블로그 시스템**: 태그, 카테고리, 검색 기능
- **코드 하이라이팅**: rehype-highlight를 활용한 코드 구문 강조
- **반응형 디자인**: Tailwind CSS 기반 모바일 최적화
- **SEO 최적화**: sitemap, robots.txt, 메타데이터

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Content**: MDX
- **Styling**: Tailwind CSS
- **Markdown Processing**: Gray Matter, Remark, Rehype
- **Date Formatting**: date-fns

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # 자기소개 페이지
│   ├── career/            # 경력 사항 페이지
│   ├── projects/          # 프로젝트 페이지
│   ├── blog/              # 블로그 페이지
│   │   ├── [slug]/        # 블로그 상세 페이지
│   │   └── tags/[tag]/    # 태그별 포스트
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   ├── sitemap.ts         # 사이트맵
│   └── robots.ts          # robots.txt
├── components/            # React 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── mdx/               # MDX 컴포넌트
├── content/               # 콘텐츠 파일
│   ├── blog/              # 블로그 포스트 (MDX)
│   └── projects/          # 프로젝트 정보 (MDX)
└── lib/                   # 유틸리티 함수
    └── blog.ts            # 블로그 관련 함수
```

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 콘텐츠 작성

#### 블로그 포스트 작성

`src/content/blog/` 폴더에 새 MDX 파일을 생성하세요:

```mdx
---
title: "포스트 제목"
date: "2025-01-20"
description: "포스트 설명"
tags: ["Next.js", "React"]
category: "frontend"
---

# 포스트 내용

여기에 마크다운으로 작성합니다...
```

#### 프로젝트 추가

`src/content/projects/` 폴더에 새 MDX 파일을 생성하세요:

```mdx
---
title: "프로젝트 이름"
description: "프로젝트 설명"
tags: ["React", "TypeScript"]
github: "https://github.com/username/repo"
link: "https://demo.com"
---

프로젝트 상세 설명...
```

### 4. 개인 정보 수정

다음 파일들을 수정하여 본인의 정보로 업데이트하세요:

- `src/app/about/page.mdx` - 자기소개
- `src/app/career/page.mdx` - 경력 사항
- `src/components/layout/Footer.tsx` - 연락처 정보
- `src/app/sitemap.ts` - 도메인 URL
- `src/app/robots.ts` - 도메인 URL

## 배포

### Vercel 배포

가장 쉬운 배포 방법은 [Vercel](https://vercel.com)을 사용하는 것입니다:

1. GitHub 리포지토리 생성
2. Vercel에 로그인
3. "New Project" 클릭
4. GitHub 리포지토리 연결
5. 자동 배포

### 빌드

프로덕션 빌드:

```bash
pnpm build
```

빌드 결과 실행:

```bash
pnpm start
```

## 커스터마이징

### 테마 색상

`src/app/globals.css`에서 색상을 변경할 수 있습니다.

### 네비게이션

`src/components/layout/Navigation.tsx`에서 메뉴 항목을 수정할 수 있습니다.

### MDX 컴포넌트

`mdx-components.tsx`에서 MDX 렌더링 스타일을 커스터마이징할 수 있습니다.

## 라이선스

MIT

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Nextra](https://nextra.site/)
- [Tailwind CSS](https://tailwindcss.com/)
