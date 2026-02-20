import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts, getTagCounts } from "@/lib/blog";
import { normalizeTag, POSTS_PER_PAGE, tagToSlug } from "@/lib/blog-utils";
import type { BlogPostMeta, TagCount } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { GetStaticProps } from "next";

interface BlogPageProps {
  posts: BlogPostMeta[];
  tagCounts: TagCount[];
}

type PageToken = number | "ellipsis";

function buildPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PageToken[] = [1];

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) tokens.push("ellipsis");
  for (let p = left; p <= right; p += 1) tokens.push(p);
  if (right < totalPages - 1) tokens.push("ellipsis");

  tokens.push(totalPages);
  return tokens;
}

export default function BlogPage({ posts, tagCounts }: BlogPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagKey, setSelectedTagKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!router.isReady) return;

    const q = typeof router.query.q === "string" ? router.query.q : "";
    const tag = typeof router.query.tag === "string" ? router.query.tag : "";
    const pageQuery =
      typeof router.query.page === "string" ? Number.parseInt(router.query.page, 10) : NaN;

    setSearchQuery(q);
    setSelectedTagKey(tag ? normalizeTag(tag) : null);
    setPage(Number.isFinite(pageQuery) && pageQuery > 0 ? pageQuery : 1);
  }, [router.isReady, router.query.page, router.query.q, router.query.tag]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag =
        !selectedTagKey ||
        post.tags.some((tag) => normalizeTag(tag) === selectedTagKey);

      if (!matchesTag) return false;

      if (!trimmedQuery) return true;

      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [posts, selectedTagKey, trimmedQuery]);

  useEffect(() => {
    setPage(1);
  }, [trimmedQuery, selectedTagKey]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (!router.isReady) return;

    const nextQuery: Record<string, string> = {};
    if (trimmedQuery) nextQuery.q = trimmedQuery;
    if (selectedTagKey) nextQuery.tag = selectedTagKey;
    if (currentPage > 1) nextQuery.page = String(currentPage);

    router.replace(
      {
        pathname: "/blog",
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [router, router.isReady, trimmedQuery, selectedTagKey, currentPage]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const pageTokens = useMemo(
    () => buildPageTokens(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const selectedTagLabel = selectedTagKey
    ? tagCounts.find((item) => normalizeTag(item.tag) === selectedTagKey)?.tag ||
      selectedTagKey
    : null;

  const canonical = `${SITE_URL}/blog`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ryan Stefan Dev Blog",
    description:
      "Practical build-in-public engineering posts: architecture decisions, debugging wins, and production lessons.",
    url: canonical,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: "Ryan Stefan",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Ryan Stefan",
    },
    blogPost: posts.slice(0, 30).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <Head>
        <title>Developer Blog | Ryan Stefan</title>
        <meta
          name="description"
          content="Engineering writeups from real projects: architecture, debugging, SEO infrastructure, automation, and production hardening."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta
          name="keywords"
          content="developer blog, software engineering, laravel, next.js, automation, seo engineering, build in public"
        />

        <meta property="og:title" content="Developer Blog | Ryan Stefan" />
        <meta
          property="og:description"
          content="Practical engineering posts from real production work."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Developer Blog | Ryan Stefan" />
        <meta
          name="twitter:description"
          content="Practical engineering posts from real production work."
        />

        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/30 to-white text-zinc-900">
        <section className="relative overflow-hidden px-6 pb-14 pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-highlight-200/40 blur-3xl" />
          </div>

          <div className="mx-auto flex max-w-5xl flex-col gap-6 text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600 shadow-sm">
              Dev Blog
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Build logs worth reading
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-600">
              Search across production lessons, architecture decisions, and
              debugging wins. Filter by tag, paginate through history, and find
              the exact post you need.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="order-2 lg:order-1">
              <div className="mb-6 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-md">
                    <label htmlFor="blog-search" className="sr-only">
                      Search blog posts
                    </label>
                    <input
                      id="blog-search"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search title, excerpt, or tags..."
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                    />
                  </div>

                  <div className="text-sm text-zinc-600">
                    Showing {paginatedPosts.length} of {filteredPosts.length} result
                    {filteredPosts.length === 1 ? "" : "s"}
                    {selectedTagLabel ? (
                      <>
                        {" "}
                        for <span className="font-semibold">{selectedTagLabel}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white/80 px-6 py-12 text-center shadow-sm">
                  <p className="text-lg font-semibold text-zinc-900">No matching posts</p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Try a different search query or clear tag filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTagKey(null);
                    }}
                    className="mt-5 inline-flex rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedPosts.map((post) => (
                      <BlogCard
                        key={post.slug}
                        title={post.title}
                        date={post.date}
                        excerpt={post.excerpt}
                        slug={post.slug}
                        tags={post.tags}
                        readingTime={post.readingTime}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav
                      className="mt-10 flex flex-wrap items-center justify-center gap-2"
                      aria-label="Blog pagination"
                    >
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {pageTokens.map((token, idx) =>
                        token === "ellipsis" ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-zinc-400"
                            aria-hidden
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={`page-${token}`}
                            type="button"
                            onClick={() => setPage(token)}
                            className={`min-w-[2.25rem] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                              token === currentPage
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                            }`}
                            aria-current={token === currentPage ? "page" : undefined}
                          >
                            {token}
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>

            <aside className="order-1 lg:order-2">
              <div className="sticky top-24 space-y-5">
                <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Blog stats
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    <li className="flex items-center justify-between">
                      <span>Total posts</span>
                      <strong>{posts.length}</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Tags</span>
                      <strong>{tagCounts.length}</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Filtered posts</span>
                      <strong>{filteredPosts.length}</strong>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                      Tag map
                    </h2>
                    {selectedTagKey ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTagKey(null)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
                    {tagCounts.map((item) => {
                      const key = normalizeTag(item.tag);
                      const active = key === selectedTagKey;

                      return (
                        <div key={key} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTagKey(active ? null : key)}
                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                              active
                                ? "border-brand-500 bg-brand-50 text-brand-700"
                                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            <span className="truncate pr-2">{item.tag}</span>
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                              {item.count}
                            </span>
                          </button>

                          <Link
                            href={`/blog/tag/${tagToSlug(item.tag)}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs text-zinc-500 transition hover:border-brand-300 hover:text-brand-700"
                            aria-label={`Open ${item.tag} tag page`}
                            title={`Open ${item.tag} tag page`}
                          >
                            ↗
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  const tagCounts = getTagCounts(posts);

  return {
    props: {
      posts,
      tagCounts,
    },
  };
};
