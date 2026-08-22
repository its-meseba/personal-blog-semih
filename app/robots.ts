import { MetadataRoute } from 'next'

import { SITE_URL } from './author'

/**
 * What crawlers may read.
 *
 * `/_next/` is NOT disallowed: it holds the CSS and JS Google needs to render
 * the page, and blocking it makes a modern site look broken to the renderer.
 * Only endpoints with nothing to index are closed.
 *
 * Drafts are not listed here — a `Disallow` line advertises a URL. They carry
 * `noindex` from `postMetadata()` instead, and are absent from the sitemap,
 * the Atom feed and /llms.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // JSON endpoints behind the UI (view counts, the post index).
          '/api/',
          '/private/',
          '/admin/',
        ],
      },
      // AI crawlers, named explicitly. `Allow` is the default, but stating it
      // means a future site-wide tightening cannot lock them out by accident.
      ...[
        'GPTBot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'ClaudeBot',
        'Claude-Web',
        'anthropic-ai',
        'PerplexityBot',
        'Perplexity-User',
        'Google-Extended',
        'Applebot-Extended',
        'CCBot',
      ].map(userAgent => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
