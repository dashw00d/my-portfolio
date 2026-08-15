import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dashwood.net").replace(
  /\/$/,
  ""
);
const blogDir = path.join(root, "content/blog");
const publicDir = path.join(root, "public");

function tagToSlug(tag) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readPosts() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const raw = fs.readFileSync(path.join(blogDir, name), "utf8");
      const { data } = matter(raw);
      return {
        slug: name.replace(/\.mdx$/, ""),
        date: data.date || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    });
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

const posts = readPosts();
const tags = [
  ...new Set(posts.flatMap((post) => post.tags.map((tag) => tagToSlug(tag)))),
].filter(Boolean);

const staticRoutes = [
  ["/", "weekly", "1.0"],
  ["/blog", "daily", "0.9"],
  ["/projects", "weekly", "0.7"],
  ["/privacy-policy", "monthly", "0.3"],
  ["/terms-of-service", "monthly", "0.3"],
  ["/refund-cancellation-policy", "monthly", "0.3"],
  ["/brand", "monthly", "0.5"],
  ["/forgekit", "monthly", "0.4"],
  ["/cleanlogs", "monthly", "0.4"],
  ["/card", "monthly", "0.4"],
];

const body = [
  ...staticRoutes.map(([route, changefreq, priority]) =>
    urlEntry(`${siteUrl}${route}`, null, changefreq, priority)
  ),
  ...tags.map((tag) =>
    urlEntry(`${siteUrl}/blog/tag/${tag}`, null, "weekly", "0.7")
  ),
  ...posts.map((post) =>
    urlEntry(
      `${siteUrl}/blog/${post.slug}`,
      post.date ? new Date(post.date).toISOString() : null,
      "monthly",
      "0.8"
    )
  ),
].join("\n");

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(
  path.join(publicDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

console.log(`Wrote public/sitemap.xml (${posts.length} posts) and public/robots.txt`);
