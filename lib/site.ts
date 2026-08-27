const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

export const SITE_URL = (
  env.PUBLIC_SITE_URL ||
  env.NEXT_PUBLIC_SITE_URL ||
  "https://dashwood.net"
).replace(/\/$/, "");

export const SITE_NAME = "Ryan Stefan - Dashwood";
