import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { tagToSlug } from "@/lib/blog-utils";

interface BlogPostProps {
  title: string;
  date: string;
  tags?: string[];
  readingTime?: number;
  children: React.ReactNode;
}

export default function BlogPost({
  title,
  date,
  tags = [],
  readingTime,
  children,
}: BlogPostProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      {/* Back to Blog Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Post Header */}
      <header className="mb-10 space-y-3">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <time dateTime={date}>{formattedDate}</time>
          {readingTime && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight md:text-4xl md:leading-tight">
          {title}
        </h1>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tagToSlug(tag)}`}
                className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-100"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="prose prose-zinc max-w-none
        prose-p:!leading-[1.7] prose-p:!mb-4
        prose-headings:!font-semibold prose-headings:!tracking-tight prose-headings:!text-zinc-900
        prose-h1:!text-3xl prose-h1:!mt-10 prose-h1:!mb-4
        prose-h2:!text-2xl prose-h2:!mt-8 prose-h2:!mb-3
        prose-h3:!text-xl prose-h3:!mt-6 prose-h3:!mb-2
        prose-h4:!text-lg prose-h4:!mt-5 prose-h4:!mb-2
        prose-ul:!my-4 prose-ul:!space-y-1
        prose-ol:!my-4 prose-ol:!space-y-1
        prose-li:!leading-[1.7] prose-li:!my-1
        prose-a:!text-brand-600 prose-a:!no-underline hover:prose-a:!underline prose-a:!font-medium
        prose-code:!text-brand-700 prose-code:!bg-brand-50 prose-code:!px-1.5 prose-code:!py-0.5 prose-code:!rounded prose-code:!text-[0.9em] prose-code:!font-mono prose-code:!font-normal prose-code:!before:content-[''] prose-code:!after:content-['']
        prose-pre:!my-5 prose-pre:!bg-zinc-900 prose-pre:!text-zinc-100 prose-pre:!border-0 prose-pre:!rounded-lg prose-pre:!p-4 prose-pre:!overflow-x-auto prose-pre:!text-sm prose-pre:!leading-[1.6]
        prose-blockquote:!my-5 prose-blockquote:!border-l-4 prose-blockquote:!border-brand-500 prose-blockquote:!pl-4 prose-blockquote:!italic prose-blockquote:!text-zinc-600
        prose-img:!rounded-lg prose-img:!shadow-md prose-img:!my-6
        prose-hr:!my-8 prose-hr:!border-zinc-200
        prose-strong:!font-semibold prose-strong:!text-zinc-900
        [&>:first-child]:!mt-0
        [&_pre_code]:!text-zinc-100 [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!rounded-none [&_pre_code]:!text-sm">
        {children}
      </div>
    </article>
  );
}
