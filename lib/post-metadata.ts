import type { Metadata } from "next";
import {
  PostFrontmatter,
  SITE_URL,
  postCanonicalUrl,
  postOgPath,
  postPath,
} from "./post-types";
import { author } from "@/app/author";
import { atomAlternateTypes } from "./feed-links";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Builds the Next metadata for one post from its `post` export.
 *
 * Every post file calls this, so no post can ship without a canonical URL,
 * an OpenGraph card and a Twitter card. Drafts are marked `noindex`.
 *
 * The canonical is self-referencing (`/<year>/<slug>`) unless the post declares
 * a `canonical` — the escape hatch for a piece that was published elsewhere
 * first. See `docs/PUBLISHING.md`.
 */
export function postMetadata(post: PostFrontmatter): Metadata {
  const canonicalUrl = postCanonicalUrl(post);
  const ogImage = {
    url: postOgPath(post.slug),
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: post.title,
  };
  const isDraft = post.status === "draft";

  return {
    metadataBase: new URL(SITE_URL),
    title: post.title,
    description: post.description,
    authors: [{ name: author.name, url: SITE_URL }],
    keywords: post.tags,
    alternates: {
      canonical: post.canonical ?? postPath(post),
      types: atomAlternateTypes(),
    },
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      // OG `url` follows the canonical too, so a shared card and the search
      // index never disagree about where the piece lives.
      url: canonicalUrl,
      siteName: author.name,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: author.handle,
      images: [ogImage],
    },
  };
}
