# Blog Post Template

This template shows how to create a new blog post with optional YouTube video.

## Steps to Create a New Post

### 1. Create Post Directory
Create a new folder in `app/(post)/2026/` with your post slug:
```
app/(post)/2026/your-post-slug/page.mdx
```

### 2. Add to posts.json
Add your post to `app/posts.json`:
```json
{
  "id": "your-post-slug",
  "date": "2025-01-15",
  "title": "Your Post Title",
  "series": "Founder Insights"
}
```

### 3. Post Structure

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'Brief description of your post',
  openGraph: {
    title: 'Your Post Title',
    description: 'Brief description of your post',
    images: [{ url: '/og/your-post-slug' }]
  }
}

{/* OPTIONAL: YouTube Video at the top */}
import { YouTube } from "../components/youtube"

<YouTube videoId="YOUR_VIDEO_ID" />

{/* Post content starts here */}

Your blog post content goes here...

## Section Heading

More content...
```

## YouTube Video Integration

To add a YouTube video at the top of any post:

1. Import the YouTube component:
```mdx
import { YouTube } from "../components/youtube"
```

2. Add the video with its ID (from the URL `youtube.com/watch?v=VIDEO_ID`):
```mdx
<YouTube videoId="dQw4w9WgXcQ" />
```

The video will render responsively at the top of your post.

## Available Series

Add one of these to the `series` field in posts.json:
- `Founder Insights` - Entrepreneurship and leadership
- `Tech Deep Dives` - Technical explorations
- `Agentic Coding` - AI-assisted development

Or add new series in `app/series.ts`.
