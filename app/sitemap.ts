import { MetadataRoute } from 'next'

import { getPublishedPosts, getSeries } from '@/lib/content'
import { SITE_URL, postPath } from '@/lib/post-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Drafts are excluded on purpose: they are hidden, not broken.
  const posts = getPublishedPosts()

  const baseUrl = SITE_URL

  // Static pages. `/` is deliberately absent: it 308-redirects to /about, and
  // a sitemap should list the URL that actually answers, not the redirect.
  const staticPages = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/thoughts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },

  ]

  // Dynamic thought posts — the year comes from the post's own date.
  const thoughtPosts = posts.map((post) => ({
    url: `${baseUrl}${postPath(post)}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // A series is a body of work: it has a landing page and its own feed.
  const seriesPages = getSeries().flatMap((series) => {
    const lastModified = new Date(series.posts[0]?.date ?? Date.now())
    return [
      {
        url: `${baseUrl}/series/${series.id}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/series/${series.id}/atom`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      },
    ]
  })

  return [...staticPages, ...thoughtPosts, ...seriesPages]
}
