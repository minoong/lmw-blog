// basePath를 환경에 따라 설정
export const basePath = process.env.NODE_ENV === 'production' ? '/lmw-blog' : '';

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
