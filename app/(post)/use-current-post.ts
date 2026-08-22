"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import useSWR from "swr";

import type { Post } from "@/app/get-posts";

/**
 * The post this route is rendering, for the client chrome around the article.
 *
 * The server sends the PUBLISHED list only: `Header` and `PostFooter` are
 * client components, so anything handed to them is serialised into the flight
 * payload of every page — drafts included, which published every unfinished
 * title and standfirst in the HTML of every post.
 *
 * A draft still has to render its own page, so when the current slug is not in
 * the published list the post is fetched from `/api/view`, which resolves
 * drafts. That request already happens on every post page (the masthead polls
 * it for the view count) and SWR dedupes it by key, so this costs nothing
 * extra. Unknown slugs — `/playground` lives under this layout too — resolve to
 * `undefined`, exactly as before.
 */
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useCurrentPost(
  posts: Post[],
  options?: { refreshInterval?: number }
): { post: Post | undefined; mutate: (value?: unknown) => void } {
  const segments = useSelectedLayoutSegments();
  const slug = segments[segments.length - 1] ?? "";
  const listed = posts.find(post => post.id === slug);

  const { data, mutate } = useSWR(
    slug === "" ? null : `/api/view?id=${encodeURIComponent(slug)}`,
    fetcher,
    { fallbackData: listed, ...options }
  );

  // `/api/view` answers unknown ids with `{ error }` and a 400; keep the
  // resolved post undefined in that case instead of rendering a broken shell.
  const fetched =
    data != null && typeof (data as Post).title === "string"
      ? (data as Post)
      : undefined;

  return { post: fetched ?? listed, mutate };
}
