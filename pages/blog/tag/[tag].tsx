import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts, getTagCounts } from "@/lib/blog";
import type { BlogPostMeta, TagCount } from "@/lib/blog";
import { tagToSlug, POSTS_PER_PAGE } from "@/lib/blog-utils";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface TagPageProps {
  tag: string;
  tagSlug: string;
  posts: BlogPostMeta[];
  allTagCounts: TagCount[];
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

export default function BlogTagPage({ tag, tagSlug, posts, allTagCounts }: TagPageProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!router.isReady) return;

    const pageQuery =
      typeof router.query.page === "string" ? Number.parseInt(router.query.page, 10) : NaN;
    setPage(Number.isFinite(pageQuery) && pageQuery > 0 ? pageQuery : 1);
  }, [router.isReady, router.query.page]);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (!router.isReady) return;

    const nextQuery: Record<string, string> = {};
    if (currentPage > 1) nextQuery.page = String(currentPage);

    router.replace(
      {
        pathname: `/blog/tag/${tagSlug}`,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [router, router.isReady, currentPage, tagSlug]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  const pageTokens = useMemo(
    () => buildPageTokens(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const canonical = `${SITE_URL}/blog/tag/${tagSlug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Posts tagged ${tag}`,
    url: canonical,
    isPartOf: `${SITE_URL}/blog`,
    about: tag,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 50).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <Head>
        <title>Tag: {tag} | Developer Blog</title>
        <meta
          name="description"
          content={`Developer blog posts tagged ${tag}. ${posts.length} articles with practical engineering and production lessons.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        <meta property="og:title" content={`Tag: ${tag} | Developer Blog`} />
        <meta
          property="og:description"
          content={`Browse ${posts.length} posts tagged ${tag} on ${SITE_NAME}.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Tag: ${tag} | Developer Blog`} />
        <meta
          name="twitter:description"
          content={`Browse ${posts.length} posts tagged ${tag}.`}
        />

        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/30 to-white text-zinc-900">
        <section className="px-6 pb-12 pt-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Blog tag
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">#{tag}</h1>
            <p className="mt-3 text-zinc-600">
              {posts.length} post{posts.length === 1 ? "" : "s"} tagged with <strong>{tag}</strong>.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-flex text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              ← Back to all posts
            </Link>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
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
                <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Tag pagination">
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
                      <span key={`ellipsis-${idx}`} className="px-2 text-zinc-400" aria-hidden>
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
            </div>

            <aside>
              <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Tag map</h2>
                <div className="mt-4 max-h-[520px] space-y-2 overflow-auto pr-1">
                  {allTagCounts.map((item) => {
                    const slug = tagToSlug(item.tag);
                    const active = slug === tagSlug;

                    return (
                      <Link
                        key={slug}
                        href={`/blog/tag/${slug}`}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                          active
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        <span className="truncate pr-2">{item.tag}</span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                          {item.count}
                        </span>
                      </Link>
                    );
                  })}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const tagCounts = getTagCounts(posts);

  return {
    paths: tagCounts.map((item) => ({
      params: { tag: tagToSlug(item.tag) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tagSlug = String(params?.tag || "");
  const posts = getAllPosts();
  const allTagCounts = getTagCounts(posts);

  const matchingTags = allTagCounts.filter((item) => tagToSlug(item.tag) === tagSlug);
  if (!matchingTags.length) {
    return {
      notFound: true,
    };
  }

  const tag = matchingTags[0].tag;
  const taggedPosts = posts.filter((post) =>
    post.tags.some((postTag) => tagToSlug(postTag) === tagSlug)
  );

  if (!taggedPosts.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tag,
      tagSlug,
      posts: taggedPosts,
      allTagCounts,
    },
  };
};
