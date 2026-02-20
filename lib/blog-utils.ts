export const POSTS_PER_PAGE = 12;

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function tagToSlug(tag: string): string {
  return normalizeTag(tag)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
