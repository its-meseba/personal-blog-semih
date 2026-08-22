"use client";

import Link from "next/link";

import type { Post } from "@/app/get-posts";
import { useCurrentPost } from "./use-current-post";
import { getSeriesConfig } from "@/app/series";
import { formatDate } from "@/app/components/post-list";
import { relatedPosts } from "@/lib/related";

/**
 * What happens after the last paragraph: where this post sits in its series,
 * what to read next, and one place to subscribe.
 *
 * The subscribe block is a slot on purpose. There is no signup backend yet,
 * so it points at the feed and the timeline instead of collecting an address
 * it cannot store.
 */
export function PostFooter({ posts }: { posts: Post[] }) {
  const { post } = useCurrentPost(posts);

  if (post == null) return null;

  const config = post.series ? getSeriesConfig(post.series) : undefined;
  const seriesPosts = config
    ? posts
        .filter(entry => entry.series === post.series && entry.status !== "draft")
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    : [];

  const related = relatedPosts(post, posts);

  return (
    <footer className="mt-chapter">
      {config && seriesPosts.length > 1 && (
        <section className="mb-block rounded-card border border-border bg-surface p-5">
          <p className="font-mono text-micro uppercase tracking-tag text-accent">
            Series
          </p>
          <h2 className="mt-2 font-display text-h3 font-semibold text-fg">
            <Link
              href={`/series/${config.id}`}
              className="transition-colors duration-quick ease-console hover:text-accent"
            >
              {config.name}
            </Link>
          </h2>
          {config.description && (
            <p className="mt-2 font-serif text-ui text-muted">
              {config.description}
            </p>
          )}

          <ol className="mt-4 space-y-2">
            {seriesPosts.map((entry, index) => {
              const current = entry.id === post.id;
              return (
                <li
                  key={entry.id}
                  className="flex items-baseline gap-3 font-display text-ui"
                >
                  <span className="shrink-0 font-mono text-meta tabular-nums text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {current ? (
                    <span aria-current="page" className="text-fg">
                      {entry.title}
                    </span>
                  ) : (
                    <Link
                      href={`/${entry.year}/${entry.id}`}
                      className="text-muted transition-colors duration-quick ease-console hover:text-accent"
                    >
                      {entry.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-block">
          <h2 className="mb-4 border-t border-border pt-rhythm font-mono text-micro uppercase tracking-tag text-faint">
            Read next
          </h2>

          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map(entry => (
              <li key={entry.id}>
                <Link
                  href={`/${entry.year}/${entry.id}`}
                  className="group flex h-full flex-col gap-2 rounded-card border border-border p-4 transition-colors duration-quick ease-console hover:border-border-strong hover:bg-surface"
                >
                  <span className="font-display text-ui font-medium leading-snug text-fg transition-colors duration-quick ease-console group-hover:text-accent">
                    {entry.title}
                  </span>
                  <span className="mt-auto font-mono text-meta tabular-nums text-faint">
                    {formatDate(entry.date)} / {entry.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SubscribeSlot />
    </footer>
  );
}

/** Subscribe slot. Wired to the feed today, to a list when one exists. */
export function SubscribeSlot() {
  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="font-display text-h4 font-semibold text-fg">
        Get the next one
      </h2>
      <p className="mt-2 font-serif text-ui text-muted">
        No mailing list yet. The Atom feed carries every post in full, and the
        short version usually shows up on X first.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 font-mono text-meta uppercase tracking-tag">
        <Link
          href="/atom"
          className="rounded-sm bg-accent-field px-3 py-2 text-accent-ink transition-colors duration-quick ease-console hover:bg-accent-field-hover"
        >
          Atom feed
        </Link>
        <a
          href="https://x.com/its_meseba"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-border-strong px-3 py-2 text-muted transition-colors duration-quick ease-console hover:border-accent hover:text-accent"
        >
          @its_meseba
        </a>
      </div>
    </section>
  );
}
