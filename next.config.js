/** @type {import('next').NextConfig} */

const useStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  output: useStaticExport ? "export" : "standalone",
  trailingSlash: useStaticExport,
  images: useStaticExport ? { unoptimized: true } : { domains: [] },
  basePath: process.env.NEXT_BASE_PATH || "",
};

module.exports = nextConfig;
