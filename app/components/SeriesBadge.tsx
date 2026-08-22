import Link from "next/link";

import { getSeriesConfig } from "../series";

/**
 * One series treatment for the whole site: a mono uppercase tag in the accent,
 * linking to that series' landing page. Series used to carry three unrelated
 * stock hues; the Console palette has exactly one accent (see design.md B).
 */

const TAG =
  "inline-flex items-center rounded-xs border border-accent/30 bg-accent-subtle px-1.5 py-0.5 font-mono uppercase tracking-tag text-accent transition-colors duration-quick ease-console";

export function SeriesTag({
  series,
  size = "sm",
}: {
  series?: string;
  size?: "sm" | "md";
}) {
  if (!series) return null;

  const config = getSeriesConfig(series);
  if (!config) return null;

  const scale = size === "md" ? "text-meta" : "text-micro";

  return (
    <Link
      href={`/series/${config.id}`}
      className={`${TAG} ${scale} hover:border-accent hover:text-accent-hover`}
    >
      {config.name}
    </Link>
  );
}

/** Non-linking variant, for places that are already inside a link. */
export function SeriesBadge({
  series,
  size = "sm",
}: {
  series?: string;
  size?: "sm" | "md";
}) {
  if (!series) return null;

  const config = getSeriesConfig(series);
  if (!config) return null;

  const scale = size === "md" ? "text-meta" : "text-micro";

  return <span className={`${TAG} ${scale}`}>{config.name}</span>;
}
