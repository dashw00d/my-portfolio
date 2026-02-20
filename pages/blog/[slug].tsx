import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogPost from "@/components/BlogPost";
import {
  getAllPostSlugs,
  getAllPosts,
  getPostBySlug,
  BlogPost as BlogPostType,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface AdjacentPost {
  slug: string;
  title: string;
}

interface BlogPostPageProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
}

export default function BlogPostPage({
  post,
  mdxSource,
  previousPost,
  nextPost,
}: BlogPostPageProps) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    wordCount: post.content.trim().split(/\s+/).length,
    keywords: post.tags.join(", "),
    articleSection: post.tags[0] || "Engineering",
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Ryan Stefan",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{post.title} | {SITE_NAME}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={postUrl} />
        {previousPost ? (
          <link rel="prev" href={`${SITE_URL}/blog/${previousPost.slug}`} />
        ) : null}
        {nextPost ? <link rel="next" href={`${SITE_URL}/blog/${nextPost.slug}`} /> : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/20 to-white py-20 text-zinc-900">
        <BlogPost
          title={post.title}
          date={post.date}
          tags={post.tags}
          readingTime={post.readingTime}
        >
          <MDXRemote {...mdxSource} />
        </BlogPost>

        {(previousPost || nextPost) && (
          <section className="mx-auto mt-10 grid max-w-3xl gap-4 px-6 md:grid-cols-2">
            <div>
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white/80 p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Newer post
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{nextPost.title}</p>
                </Link>
              ) : null}
            </div>
            <div>
              {previousPost ? (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white/80 p-4 text-right transition hover:border-brand-300 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Older post
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{previousPost.title}</p>
                </Link>
              ) : null}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((item) => item.slug === slug);

  const nextPost =
    currentIndex > 0
      ? {
          slug: allPosts[currentIndex - 1].slug,
          title: allPosts[currentIndex - 1].title,
        }
      : null;

  const previousPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? {
          slug: allPosts[currentIndex + 1].slug,
          title: allPosts[currentIndex + 1].title,
        }
      : null;

  try {
    const mdxSource = await serialize(post.content, {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    });

    return {
      props: {
        post,
        mdxSource,
        previousPost,
        nextPost,
      },
    };
  } catch (error) {
    // Skip malformed generated MDX entries rather than failing the entire site build.
    console.warn(`[blog] Skipping malformed post: ${slug}`, error);
    return {
      notFound: true,
    };
  }
};
