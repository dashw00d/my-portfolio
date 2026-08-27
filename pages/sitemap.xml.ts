import type { APIRoute } from "astro";

import { getAllPosts, getTagCounts } from "@/lib/blog";
import { tagToSlug } from "@/lib/blog-utils";
import { SITE_URL } from "@/lib/site";

export const prerender = true;

function urlEntry(loc: string, lastmod?: string | null, changefreq?: string, priority?: string) {
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

export const GET: APIRoute = () => {
  const posts = getAllPosts();
  const tags = getTagCounts(posts).map((item) => tagToSlug(item.tag)).filter(Boolean);

  const staticRoutes: Array<[string, string, string]> = [
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
      urlEntry(`${SITE_URL}${route}`, null, changefreq, priority)
    ),
    ...tags.map((tag) => urlEntry(`${SITE_URL}/blog/tag/${tag}`, null, "weekly", "0.7")),
    ...posts.map((post) =>
      urlEntry(
        `${SITE_URL}/blog/${post.slug}`,
        post.date ? new Date(post.date).toISOString() : null,
        "monthly",
        "0.8"
      )
    ),
  ].join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    }
  );
};
