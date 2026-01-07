"use client";

import Link from "next/link";
import useSWR from "swr";
import { SeriesBadge } from "@/app/components/SeriesBadge";

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

interface Post {
    id: string;
    title: string;
    date: string;
    series?: string;
    excerpt?: string;
    readTime: string;
    viewsFormatted: string;
}

export function LatestPostsSection() {
    const { data: posts, isLoading } = useSWR<Post[]>("/api/posts", fetcher);

    // Get the latest 2 posts
    const latestPosts = posts
        ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Latest Posts
                </h2>
                <Link
                    href="/thoughts"
                    className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    View all →
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border border-gray-200 dark:border-gray-700 animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : latestPosts && latestPosts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {latestPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/2026/${post.id}`}
                            className="group bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
                        >
                            {post.series && (
                                <div className="mb-2">
                                    <SeriesBadge series={post.series} size="sm" />
                                </div>
                            )}
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mb-2 line-clamp-2">
                                {post.title}
                            </h3>
                            {post.excerpt && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                <span>{formatDate(post.date)}</span>
                                <span>·</span>
                                <span>{post.readTime}</span>
                                <span>·</span>
                                <span>{post.viewsFormatted} views</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No posts yet.
                </div>
            )}
        </section>
    );
}
