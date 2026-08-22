import type { Metadata } from "next";
import Link from "next/link";

import { getSeries } from "@/lib/content";
import { atomAlternateTypes } from "@/lib/feed-links";
import { SITE_URL } from "@/lib/post-types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Series",
  description:
    "Bodies of work rather than scattered posts: every series on semihbabacan.com.",
  alternates: {
    canonical: `${SITE_URL}/series`,
    types: atomAlternateTypes(),
  },
};

/** Index of series. Each one is its own reading order and its own feed. */
export default async function SeriesIndexPage() {
  const allSeries = getSeries();

  return (
    <main className="mx-auto w-full max-w-shell pb-chapter">
      <header className="mb-block">
        <h1 className="font-display text-display font-semibold tracking-tight text-fg">
          Series
        </h1>
        <p className="mt-3 max-w-measure font-serif text-lead text-muted">
          Where several posts make one argument, they are grouped here.
        </p>
      </header>

      {allSeries.length === 0 ? (
        <p className="py-block text-center font-mono text-meta text-faint">
          No series yet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {allSeries.map(series => (
            <li key={series.id}>
              <Link
                href={`/series/${series.id}`}
                className="group flex h-full flex-col gap-2 rounded-card border border-border p-5 transition-colors duration-quick ease-console hover:border-border-strong hover:bg-surface"
              >
                <span className="font-display text-h4 font-semibold text-fg transition-colors duration-quick ease-console group-hover:text-accent">
                  {series.name}
                </span>
                {series.description && (
                  <span className="font-serif text-ui text-muted">
                    {series.description}
                  </span>
                )}
                <span className="mt-auto pt-2 font-mono text-meta tabular-nums text-faint">
                  {series.posts.length}{" "}
                  {series.posts.length === 1 ? "post" : "posts"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
