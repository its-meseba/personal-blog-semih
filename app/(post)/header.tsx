"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import type { Post } from "@/app/get-posts";
import { SeriesBadge } from "@/app/components/SeriesBadge";
import { AuthorCard } from "@/app/components/AuthorCard";

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

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
    <header className="mb-8">
      {/* Series Badge */}
      {post.series && (
        <div className="mb-4">
          <SeriesBadge series={post.series} size="md" />
        </div>
      )}

      {/* Title - Large, bold, sans-serif */}
      <h1
        className="text-3xl md:text-[42px] font-bold leading-tight tracking-tight mb-4"
        style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
      >
        {post.title}
      </h1>

      {/* Author Section */}
      <AuthorCard
        date={formatDate(post.date)}
        readTime={post.readTime}
      />

      {/* Views Counter (subtle) */}
      <Views
        id={post.id}
        mutate={mutate}
        defaultValue={post.viewsFormatted}
      />
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

  return views != null ? (
    <p
      className="text-sm mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
      style={{ fontFamily: 'Inter, -apple-system, sans-serif', color: 'rgba(117, 117, 117, 1)' }}
    >
      {views} views
    </p>
  ) : null;
}
