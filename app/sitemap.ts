import { MetadataRoute } from "next";

import { getPublishedPosts, getSeries } from "@/lib/content";
import { SITE_URL, postPath } from "@/lib/post-types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Drafts are excluded on purpose: they are hidden, not broken.
  const posts = getPublishedPosts();

  const baseUrl = SITE_URL;

  // Static pages. `/` is deliberately absent: it 308-redirects to /about, and
  // a sitemap should list the URL that actually answers, not the redirect.
  const staticPages = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/thoughts`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic thought posts — the year comes from the post's own date.
  // `lastModified` is the post's `dateModified` — the author-declared
  // `updated`, or `date` when the post has never been revised. A post really
  // revised after it shipped should re-surface to crawlers; one whose file was
  // merely touched by a migration must not.
  const thoughtPosts = posts.map(post => ({
    url: `${baseUrl}${postPath(post)}`,
    lastModified: new Date(post.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // A series is a body of work: it has a landing page and its own feed.
  // `lastModified` is the newest `dateModified` across every post in the
  // series, not just the newest post's `date` — an older post edited after
  // a newer one shipped should still bump the series page's freshness.
  const seriesPages = getSeries().flatMap(series => {
    const lastModified = new Date(
      series.posts.reduce(
        (latestMs, post) => Math.max(latestMs, Date.parse(post.dateModified)),
        0
      )
    );
    return [
      {
        url: `${baseUrl}/series/${series.id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/series/${series.id}/atom`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.4,
      },
    ];
  });

  return [...staticPages, ...thoughtPosts, ...seriesPages];
}
