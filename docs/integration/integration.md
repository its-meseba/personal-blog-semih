# Blog Post Integration Guide

This guide explains how to add a new blog post to the series and ensure it's properly indexed by search engines and AI systems.

## Quick Steps

1. **Create the post** (MDX file)
2. **Register in `posts.json`** 
3. **Update `llms.txt`** for AI discoverability
4. **Verify sitemap.xml** (auto-generated)

---

## Step 1: Create the Post

Create a new folder and MDX file:

```
app/(post)/2026/your-post-slug/page.mdx
```

### MDX Template

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'Brief description for SEO and social sharing',
  openGraph: {
    title: 'Your Post Title',
    description: 'Brief description for SEO and social sharing',
    images: [{ url: '/og/your-post-slug' }]
  }
}

{/* Optional: YouTube video at top */}
import { YouTube } from "../components/youtube"

<YouTube videoId="YOUR_VIDEO_ID" />

{/* Post content */}

Your blog post content starts here...

## Section Heading

More content...
```

---

## Step 2: Register in posts.json

Add your post to [posts.json](file:///Users/mehmetsemihbabacan/dev/work/lumio-studio/web-apps/personal-blog-semih/app/posts.json):

```json
{
  "id": "your-post-slug",
  "date": "2025-01-20",
  "title": "Your Post Title",
  "series": "Founder Insights"
}
```

### Available Series

| Series | Color | Description |
|--------|-------|-------------|
| `Founder Insights` | Blue | Entrepreneurship and leadership |
| `Tech Deep Dives` | Purple | Technical explorations |
| `Agentic Coding` | Green | AI-assisted development |

To add a new series, update [series.ts](file:///Users/mehmetsemihbabacan/dev/work/lumio-studio/web-apps/personal-blog-semih/app/series.ts).

---

## Step 3: Update llms.txt

Add your post URL to [public/llms.txt](file:///Users/mehmetsemihbabacan/dev/work/lumio-studio/web-apps/personal-blog-semih/public/llms.txt):

```txt
https://mehmetsemihbabacan.com/2026/your-post-slug
```

### What is llms.txt?

The `llms.txt` file is a convention for telling AI systems (ChatGPT, Claude, Perplexity, etc.) which pages on your site are suitable for training and reference. It's similar to `robots.txt` but specifically for LLM crawlers.

### Why update it?

- **AI Discoverability**: Your post becomes visible to AI search tools
- **Accurate Referencing**: AI assistants can cite your content correctly
- **Thought Leadership**: Your insights reach AI-powered platforms

---

## Step 4: Verify Automatic Updates

### sitemap.xml (Auto-generated)

The sitemap is dynamically generated from `posts.json` by [sitemap.ts](file:///Users/mehmetsemihbabacan/dev/work/lumio-studio/web-apps/personal-blog-semih/app/sitemap.ts).

**No manual update needed** - your post will automatically appear at:
```
https://mehmetsemihbabacan.com/sitemap.xml
```

With priority `0.6` and `monthly` change frequency.

### robots.txt (Already configured)

The [robots.ts](file:///Users/mehmetsemihbabacan/dev/work/lumio-studio/web-apps/personal-blog-semih/app/robots.ts) file is pre-configured to:

- Allow all crawlers on public pages
- Block `/api/`, `/private/`, `/_next/`, `/admin/`
- Explicitly allow AI crawlers: GPTBot, ChatGPT-User, Claude-Web, anthropic-ai, Perplexity

**No update needed** for new blog posts.

---

## Integration Checklist

```
[ ] Create app/(post)/2026/{slug}/page.mdx with metadata export
[ ] Add post entry to app/posts.json with date, title, and series
[ ] Add post URL to public/llms.txt
[ ] Run `pnpm dev` and verify post appears on /thoughts
[ ] Verify series badge displays correctly
[ ] Check sitemap.xml includes new post (after deployment)
```

---

## File Reference

| File | Purpose | Update Needed? |
|------|---------|----------------|
| `app/(post)/2026/{slug}/page.mdx` | Post content | ✅ Create new |
| `app/posts.json` | Post registry | ✅ Add entry |
| `public/llms.txt` | AI discoverability | ✅ Add URL |
| `app/sitemap.ts` | Sitemap generation | ❌ Auto |
| `app/robots.ts` | Crawler rules | ❌ Pre-configured |
| `app/series.ts` | Series definitions | ⚠️ Only if new series |
