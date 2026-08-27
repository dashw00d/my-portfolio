import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";

export default defineConfig([
  ...astro.configs.recommended,
  {
    rules: {
      "astro/no-set-html-directive": "off",
    },
  },
  globalIgnores(["dist/**", "out/**", ".astro/**", "node_modules/**", "draft/**"]),
]);
