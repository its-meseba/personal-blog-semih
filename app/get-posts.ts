import commaNumber from "comma-number";

import { db } from "./firebase";
import {
  getAllPosts as getIndexedAllPosts,
  getPost as getIndexedPost,
  getPosts as getIndexedPosts,
} from "@/lib/content";
import type { IndexedPost } from "@/lib/post-types";

/**
 * A post as the UI consumes it: the generated index plus live Firebase views.
 * The index is the single source of truth for everything except the view count.
 */
export type Post = Omit<IndexedPost, "body"> & {
  views: number;
  viewsFormatted: string;
};

// shape of views from Firebase
type Views = {
  [key: string]: number;
};

async function fetchViews(): Promise<Views> {
  try {
    return await db.getViews();
  } catch (error) {
    console.warn("Failed to fetch views from Firebase, using defaults:", error);
    // Continue with empty views object - posts will show 0 views
    return {};
  }
}

function withViews(post: IndexedPost, allViews: Views): Post {
  const { body: _body, ...rest } = post;
  const views = Number(allViews?.[post.id] ?? 0);
  return {
    ...rest,
    views,
    viewsFormatted: commaNumber(views),
  };
}

export const getPosts = async (): Promise<Post[]> => {
  const allViews = await fetchViews();
  return getIndexedPosts().map(post => withViews(post, allViews));
};

/**
 * Every post on disk, drafts included. The post route needs this: a draft
 * still renders at its own URL (with `noindex`), so its header, byline and
 * footer must resolve even in production, where `getPosts()` hides drafts.
 */
export const getAllPosts = async (): Promise<Post[]> => {
  const allViews = await fetchViews();
  return getIndexedAllPosts().map(post => withViews(post, allViews));
};

export const getPost = async (slug: string): Promise<Post | undefined> => {
  const post = getIndexedPost(slug);
  if (!post) return undefined;
  return withViews(post, await fetchViews());
};
