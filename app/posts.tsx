"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import useSWR from "swr";
import type { Post } from "./get-posts";
import React from "react";
import { SeriesBadge } from "./components/SeriesBadge";
import { author } from "./author";

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function Posts({ posts: initialPosts }: { posts: Post[] }) {
  const [selectedSeries, setSelectedSeries] = useState<string>("all");

  const { data: posts } = useSWR(
    "/api/posts",
    fetcher,
    {
      fallbackData: initialPosts,
      refreshInterval: 5000,
    }
  );

  // Get unique series from posts
  const availableSeries = useMemo(() => {
    const seriesSet = new Set<string>();
    posts.forEach((post: Post) => {
      if (post.series) seriesSet.add(post.series);
    });
    return Array.from(seriesSet);
  }, [posts]);

  // Filter and sort posts by date (newest first)
  const filteredPosts = useMemo(() => {
    let result = selectedSeries === "all"
      ? posts
      : posts.filter((post: Post) => post.series === selectedSeries);

    return [...result].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [posts, selectedSeries]);

  return (
    <Suspense fallback={null}>
      <main className="max-w-3xl mx-auto mb-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thoughts on building, leading, and innovating in tech.
          </p>
        </div>

        {/* Series Filter Pills */}
        {availableSeries.length > 0 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setSelectedSeries("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedSeries === "all"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              All
            </button>
            {availableSeries.map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedSeries === series
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                {series}
              </button>
            ))}
          </div>
        )}

        {/* Post Cards */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-0">
            {filteredPosts.map((post: Post) => (
              <article key={post.id} className="post-card">
                <Link href={`/2026/${post.id}`} className="block group">
                  <h2 className="post-card-title group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="post-card-excerpt">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="post-card-meta">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <span>{post.viewsFormatted} views</span>
                    {post.series && (
                      <>
                        <span>·</span>
                        <SeriesBadge series={post.series} size="sm" />
                      </>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            No posts found.
          </div>
        )}
      </main>
    </Suspense>
  );
}
