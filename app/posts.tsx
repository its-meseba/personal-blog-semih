"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import type { Post } from "./get-posts";
import { PostList } from "./components/post-list";
import { getSeriesConfig } from "./series";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ALL = "all";

/**
 * How long the staggered row entrance is allowed to run before the list drops
 * the markup that drives it. Comfortably past the last row's landing
 * (`--dur-base` 200ms + eight `--stagger-step` delays = 520ms), and the point
 * of dropping it is that a series filter click afterwards re-renders the rows
 * with no animation attached at all - the entrance is a first-load event, not
 * a response to filtering.
 */
const ROW_ENTER_WINDOW_MS = 600;

/**
 * The writing index.
 *
 * Hierarchy, not a flat changelog: the newest post gets the lead treatment,
 * the rest are month-grouped rows with a single rule per month. The series
 * filter is a quiet segmented control rather than a row of coloured pills.
 */
export function Posts({ posts: initialPosts }: { posts: Post[] }) {
  const [selectedSeries, setSelectedSeries] = useState<string>(ALL);

  // True for the first paint (server render included), then permanently off.
  // Dropping it after the animation has already finished changes nothing on
  // screen - the keyframes end on the row's natural resting state.
  const [enterRows, setEnterRows] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setEnterRows(false), ROW_ENTER_WINDOW_MS);
    return () => clearTimeout(timer);
  }, []);

  // View counts stay live; this is the same request cadence as before.
  const { data: posts } = useSWR("/api/posts", fetcher, {
    fallbackData: initialPosts,
    refreshInterval: 5000,
  });

  const availableSeries = useMemo(() => {
    const seen = new Set<string>();
    (posts as Post[]).forEach(post => {
      if (post.series) seen.add(post.series);
    });
    return Array.from(seen);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const result =
      selectedSeries === ALL
        ? (posts as Post[])
        : (posts as Post[]).filter(post => post.series === selectedSeries);

    return [...result].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [posts, selectedSeries]);

  return (
    <Suspense fallback={null}>
      <main className="mx-auto w-full max-w-shell pb-chapter">
        <header className="mb-block">
          <h1 className="font-display text-display font-semibold tracking-tight text-fg">
            Writing
          </h1>
          <p className="mt-3 max-w-measure font-serif text-lead text-muted">
            Notes on agents, AI products, and the way software gets built when
            the tooling writes back.
          </p>
        </header>

        {availableSeries.length > 0 && (
          <nav
            aria-label="Filter by series"
            className="mb-block -mx-6 overflow-x-auto px-6 sm:mx-0 sm:overflow-visible sm:px-0"
          >
            <div className="inline-flex min-w-max items-center gap-0.5 rounded-lg border border-border bg-surface p-1 font-mono text-micro uppercase tracking-tag">
              <FilterButton
                label="All"
                active={selectedSeries === ALL}
                onClick={() => setSelectedSeries(ALL)}
              />
              {availableSeries.map(name => (
                <FilterButton
                  key={name}
                  label={getSeriesConfig(name)?.name ?? name}
                  active={selectedSeries === name}
                  onClick={() => setSelectedSeries(name)}
                />
              ))}
            </div>
          </nav>
        )}

        <PostList posts={filteredPosts} enterRows={enterRows} />
      </main>
    </Suspense>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-sm px-2.5 py-1.5 transition-colors duration-quick ease-console ${
        active
          ? "bg-accent-field text-accent-ink"
          : "text-muted hover:bg-surface-hover hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}
