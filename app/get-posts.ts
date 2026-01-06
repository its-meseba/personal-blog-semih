import postsData from "./posts.json";
import { db } from "./firebase";
import commaNumber from "comma-number";
import { getReadTime } from "./author";

// Type for posts as they exist in the JSON file
type PostData = {
  id: string;
  date: string;
  title: string;
  series?: string;
  excerpt?: string;
};

export type Post = PostData & {
  views: number;
  viewsFormatted: string;
  readTime: string;
};

// shape of views from Firebase
type Views = {
  [key: string]: number;
};

export const getPosts = async () => {
  let allViews: Views = {};

  try {
    console.log("Fetching all views from Firebase");
    allViews = await db.getViews();
    console.log("Retrieved views:", allViews);
  } catch (error) {
    console.warn("Failed to fetch views from Firebase, using defaults:", error);
    // Continue with empty views object - posts will show 0 views
  }

  const posts = (postsData.posts as PostData[]).map((post): Post => {
    const views = Number(allViews?.[post.id] ?? 0);
    console.log(`Post ${post.id}: ${views} views`);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
      readTime: getReadTime(post.id),
    };
  });

  console.log(`Processed ${posts.length} posts`);
  return posts;
};


