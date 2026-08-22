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
    year: string;
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
        <section className="mb-section">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-h3 font-semibold tracking-tight text-fg md:text-h2">
                    Latest Posts
                </h2>
                <Link
                    href="/thoughts"
                    className="font-mono text-meta uppercase tracking-tag text-muted transition-colors duration-quick ease-console hover:text-accent"
                >
                    View all →
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="rounded-card border border-border bg-surface p-5 animate-pulse"
                        >
                            <div className="h-4 bg-surface-hover rounded w-1/4 mb-3"></div>
                            <div className="h-5 bg-surface-hover rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-surface-hover rounded w-full mb-3"></div>
                            <div className="h-3 bg-surface-hover rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : latestPosts && latestPosts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {latestPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/${post.year}/${post.id}`}
                            className="group rounded-card border border-border bg-surface p-5 hover:border-border-strong transition-colors duration-quick ease-console"
                        >
                            {post.series && (
                                <div className="mb-2">
                                    <SeriesBadge series={post.series} size="sm" />
                                </div>
                            )}
                            <h3 className="mb-2 line-clamp-2 font-display text-ui font-medium leading-snug text-fg transition-colors duration-quick ease-console group-hover:text-accent">
                                {post.title}
                            </h3>
                            {post.excerpt && (
                                <p className="mb-3 line-clamp-2 font-serif text-ui text-muted">
                                    {post.excerpt}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-meta tabular-nums text-faint">
                                <span>{formatDate(post.date)}</span>
                                <span aria-hidden="true">/</span>
                                <span>{post.readTime}</span>
                                <span aria-hidden="true">/</span>
                                <span>{post.viewsFormatted} views</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted">
                    No posts yet.
                </div>
            )}
        </section>
    );
}
