// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// 프로덕션 환경에서만 Sentry 활성화
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 0.1, // 프로덕션에서는 10%만 샘플링

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Define how likely Replay events are sampled.
    replaysSessionSampleRate: 0.1, // 10% 세션 샘플링

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 샘플링

    // Enable sending user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: false, // 프로덕션에서는 PII 전송 비활성화
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
