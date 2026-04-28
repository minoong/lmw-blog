const normalizeBasePath = (path?: string) => {
  if (!path || path === '/') return '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.replace(/\/$/, '');
};

const normalizeSiteUrl = (url?: string) => (url ?? 'https://lmw-blog.vercel.app').replace(/\/$/, '');

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

// 회사별 우선순위 상수
export const COMPANY_PRIORITY: Record<string, number> = {
  코웨이: 3,
  티몬: 2,
  유채널: 1,
};

// 회사별 로고 상수
export const COMPANY_LOGOS: Record<string, string> = {
  코웨이: `${basePath}/logo/coway.svg`,
  티몬: `${basePath}/logo/tmon.svg`,
  유채널: `${basePath}/logo/uchannel.png`,
};
