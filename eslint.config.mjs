import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  ...astro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: tsParser },
    },
  },
  {
    rules: {
      "astro/no-set-html-directive": "off",
    },
  },
  globalIgnores(["dist/**", "out/**", ".astro/**", "node_modules/**", "draft/**"]),
]);
