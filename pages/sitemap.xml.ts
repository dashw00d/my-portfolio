import { GetServerSideProps } from "next";

import { getAllPosts, getTagCounts, tagToSlug } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
};

const STATIC_ROUTES: SitemapEntry[] = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/blog`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/projects`, changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE_URL}/brand`, changefreq: "monthly", priority: "0.5" },
  { loc: `${SITE_URL}/forgekit`, changefreq: "monthly", priority: "0.4" },
  { loc: `${SITE_URL}/cleanlogs`, changefreq: "monthly", priority: "0.4" },
  { loc: `${SITE_URL}/card`, changefreq: "monthly", priority: "0.4" },
];

function buildSitemapXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const parts = [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : "",
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : "",
        entry.priority ? `    <priority>${entry.priority}</priority>` : "",
        "  </url>",
      ].filter(Boolean);

      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPosts();
  const tagCounts = getTagCounts(posts);

  const postEntries: SitemapEntry[] = posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: "monthly",
    priority: "0.8",
  }));

  const tagEntries: SitemapEntry[] = tagCounts.map((item) => ({
    loc: `${SITE_URL}/blog/tag/${tagToSlug(item.tag)}`,
    changefreq: "weekly",
    priority: "0.7",
  }));

  const sitemapXml = buildSitemapXml([...STATIC_ROUTES, ...tagEntries, ...postEntries]);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(sitemapXml);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
