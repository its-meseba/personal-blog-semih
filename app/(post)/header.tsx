"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useRef } from "react";
import useSWR from "swr";

import type { Post } from "@/app/get-posts";
import { SeriesTag } from "@/app/components/SeriesBadge";
import { AuthorCard } from "@/app/components/AuthorCard";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Post masthead: series, title, standfirst, then one mono meta line.
 * Everything above the first paragraph, and nothing else.
 */
export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const initialPost = posts.find(
    post => post.id === segments[segments.length - 1]
  );

  const { data: post, mutate } = useSWR(
    `/api/view?id=${initialPost?.id ?? ""}`,
    fetcher,
    {
      fallbackData: initialPost,
      refreshInterval: 5000,
    }
  );

  if (initialPost == null) return <></>;

  return (
    <header className="mb-block border-b border-border pb-rhythm">
      {(post.series || post.status === "draft") && (
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          {post.series && <SeriesTag series={post.series} size="md" />}
          {post.status === "draft" && (
            <span className="rounded-xs border border-border-strong px-1.5 py-0.5 font-mono text-micro uppercase tracking-tag text-faint">
              Draft
            </span>
          )}
        </div>
      )}

      <h1 className="font-display text-h1 font-semibold leading-tight tracking-tight text-fg sm:text-display">
        {post.title}
      </h1>

      {post.description && (
        <p className="mt-4 font-serif text-lead text-muted">
          {post.description}
        </p>
      )}

      <AuthorCard date={formatDate(post.date)} readTime={post.readTime}>
        <Views id={post.id} mutate={mutate} defaultValue={post.viewsFormatted} />
      </AuthorCard>
    </header>
  );
}

function Views({ id, mutate, defaultValue }) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if (!didLogViewRef.current) {
      const url = "/api/view?incr=1&id=" + encodeURIComponent(id);
      fetch(url)
        .then(res => res.json())
        .then(obj => {
          mutate(obj);
        })
        .catch(console.error);
      didLogViewRef.current = true;
    }
  });

  return views != null ? <span>{views} views</span> : null;
}
