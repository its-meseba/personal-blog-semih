import Link from "next/link";

import { SeriesTag } from "./SeriesBadge";

/**
 * The shared list vocabulary: one lead treatment, one row treatment, one
 * month rule. `app/posts.tsx` (home / thoughts) and the series landing pages
 * both render from these so the two lists cannot drift apart.
 *
 * These components take plain data, not the Firebase-backed `Post`, so a
 * server page can render them without pulling the client list in.
 */

export type ListPost = {
  id: string;
  title: string;
  date: string;
  year: string;
  readTime: string;
  excerpt?: string;
  series?: string;
  status?: string;
  viewsFormatted?: string;
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function DraftTag() {
  return (
    <span className="rounded-xs border border-border-strong px-1.5 py-0.5 font-mono text-micro uppercase tracking-tag text-faint">
      Draft
    </span>
  );
}

/** Newest post: the one thing on the page that is meant to be read first. */
export function PostLead({ post }: { post: ListPost }) {
  return (
    <article className="border-b border-border pb-rhythm">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-meta uppercase tracking-tag text-accent">
          Latest
        </span>
        {post.series && <SeriesTag series={post.series} />}
        {post.status === "draft" && <DraftTag />}
      </div>

      <h2 className="font-display text-h2 font-semibold leading-tight tracking-tight text-fg sm:text-[2rem]">
        <Link
          href={`/${post.year}/${post.id}`}
          className="transition-colors duration-quick ease-console hover:text-accent"
        >
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="mt-3 max-w-measure font-serif text-lead text-muted">
          {post.excerpt}
        </p>
      )}

      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta tabular-nums text-faint">
        <span>{formatDate(post.date)}</span>
        <span aria-hidden="true">/</span>
        <span>{post.readTime}</span>
        {post.viewsFormatted && (
          <>
            <span aria-hidden="true">/</span>
            <span>{post.viewsFormatted} views</span>
          </>
        )}
      </p>
    </article>
  );
}

/** Every other post: date rail on the left at `md`, stacked below it. */
export function PostRow({ post }: { post: ListPost }) {
  return (
    <article className="grid grid-cols-1 gap-x-6 gap-y-1.5 py-rhythm md:grid-cols-[7.5rem_minmax(0,1fr)]">
      <p className="font-mono text-meta tabular-nums text-faint md:pt-1">
        {formatDate(post.date)}
      </p>

      <div className="min-w-0">
        <h3 className="font-display text-h4 font-medium leading-snug tracking-tight text-fg">
          <Link
            href={`/${post.year}/${post.id}`}
            className="transition-colors duration-quick ease-console hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="mt-1.5 font-serif text-ui leading-relaxed text-muted">
            {post.excerpt}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-meta tabular-nums text-faint">
            {post.readTime}
          </span>
          {post.series && <SeriesTag series={post.series} />}
          {post.status === "draft" && <DraftTag />}
        </div>
      </div>
    </article>
  );
}

/** The month label that replaces a hairline under every single row. */
export function MonthRule({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-4 pt-block">
      <h2 className="shrink-0 font-mono text-meta uppercase tracking-tag text-faint">
        {formatMonth(date)}
      </h2>
      <span aria-hidden="true" className="h-px grow bg-border" />
    </div>
  );
}

/** Renders lead + month-grouped rows. Used by both list surfaces. */
export function PostList({
  posts,
  withLead = true,
}: {
  posts: ListPost[];
  withLead?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <p className="py-block text-center font-mono text-meta text-faint">
        No posts here yet.
      </p>
    );
  }

  const [first, ...rest] = posts;
  const lead = withLead ? first : null;
  const rows = withLead ? rest : posts;

  let lastMonth = lead ? monthKey(lead.date) : "";

  return (
    <div>
      {lead && <PostLead post={lead} />}

      {rows.map(post => {
        const key = monthKey(post.date);
        const newMonth = key !== lastMonth;
        lastMonth = key;

        return (
          <div key={post.id}>
            {newMonth && <MonthRule date={post.date} />}
            <PostRow post={post} />
          </div>
        );
      })}
    </div>
  );
}
