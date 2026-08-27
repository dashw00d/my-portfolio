const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

export const GA_MEASUREMENT_ID =
  env.PUBLIC_GA_MEASUREMENT_ID ||
  env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  "G-45RNCPBHRD";

type GTagPrimitive = string | number | boolean | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent(action: string, params: Record<string, GTagPrimitive> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, params);
}
