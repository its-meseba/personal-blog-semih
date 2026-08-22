import type { Metadata } from "next";
import {
  PostFrontmatter,
  SITE_URL,
  postOgPath,
  postPath,
  postUrl,
} from "./post-types";
import { author } from "@/app/author";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Builds the Next metadata for one post from its `post` export.
 *
 * Every post file calls this, so no post can ship without a canonical URL,
 * an OpenGraph card and a Twitter card. Drafts are marked `noindex`.
 */
export function postMetadata(post: PostFrontmatter): Metadata {
  const url = postUrl(post);
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
      canonical: postPath(post),
      types: {
        "application/atom+xml": [{ url: "/atom", title: `${author.name} — Atom` }],
      },
    },
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url,
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
