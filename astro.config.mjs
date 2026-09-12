import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeHighlight from "rehype-highlight";
import { defineConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { phpContactPlugin } from "./scripts/vite-php-contact.js";
import { trailingSlashRedirectPlugin } from "./scripts/vite-trailing-slash.js";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  srcDir: ".",
  publicDir: "./public",
  site: "https://dashwood.net",
  trailingSlash: "always",
  server: {
    port: 3000,
    host: true,
  },
  integrations: [react(), mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [rehypeHighlight],
  },
  vite: {
    plugins: [phpContactPlugin(root), trailingSlashRedirectPlugin()],
    envPrefix: ["PUBLIC_", "NEXT_PUBLIC_"],
    resolve: {
      alias: {
        "@": root,
      },
    },
    server: {
      watch: {
        ignored: ["**/dist/**", "**/out/**", "**/.astro/**", "**/draft/**"],
      },
    },
  },
});
