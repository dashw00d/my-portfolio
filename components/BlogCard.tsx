import React from "react";
import Link from "@/components/Link";

interface BlogCardProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags?: string[];
  readingTime?: number;
}

export default function BlogCard({
  title,
  date,
  excerpt,
  slug,
  tags = [],
  readingTime,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`}>
      <article className="group flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-300">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <time dateTime={date}>{formattedDate}</time>
          {readingTime && (
            <span className="text-zinc-400">{readingTime} min read</span>
          )}
        </div>

        <h2 className="text-xl font-semibold text-zinc-900 transition-colors group-hover:text-brand-600">
          {title}
        </h2>

        <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
          {excerpt}
        </p>

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2">
          Read more
          <span aria-hidden>→</span>
        </div>
      </article>
    </Link>
  );
}
