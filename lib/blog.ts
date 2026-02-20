import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { normalizeTag, POSTS_PER_PAGE, tagToSlug } from "./blog-utils";

const blogDirectory = path.join(process.cwd(), "content/blog");

export { normalizeTag, tagToSlug, POSTS_PER_PAGE };

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  content: string;
  readingTime?: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  readingTime?: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get all blog post slugs from the content/blog directory
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

/**
 * Get all blog posts with metadata (without full content)
 * Sorted by date (newest first)
 */
export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();

  const posts = slugs.map((slug) => {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      author: data.author || "",
      readingTime: calculateReadingTime(content),
    };
  });

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single blog post by slug with full content
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      author: data.author || "",
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Build tag counts, merged case-insensitively.
 */
export function getTagCounts(postsInput?: BlogPostMeta[]): TagCount[] {
  const posts = postsInput ?? getAllPosts();
  const bucket = new Map<string, { tag: string; count: number }>();

  posts.forEach((post) => {
    post.tags.forEach((rawTag) => {
      const tag = rawTag.trim();
      if (!tag) return;

      const key = normalizeTag(tag);
      const existing = bucket.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        bucket.set(key, { tag, count: 1 });
      }
    });
  });

  return Array.from(bucket.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.tag.localeCompare(b.tag);
  });
}

/**
 * Get all unique tags from all blog posts
 */
export function getAllTags(): string[] {
  return getTagCounts().map((item) => item.tag);
}
