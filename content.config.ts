import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default(""),
    description: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog };
