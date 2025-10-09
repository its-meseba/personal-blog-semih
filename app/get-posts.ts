import postsData from "./posts.json";
import redis from "./redis";
import commaNumber from "comma-number";

// Type for posts as they exist in the JSON file
type PostData = {
  id: string;
  date: string;
  title: string;
};

export type Post = PostData & {
  views: number;
  viewsFormatted: string;
};

// shape of the HSET in redis
type Views = {
  [key: string]: string;
};

export const getPosts = async () => {
  let allViews: Views = {};

  try {
    console.log("Fetching all views from Redis");
    allViews = (await redis.hgetall("views")) || {};
    console.log("Retrieved views:", allViews);
  } catch (error) {
    console.warn("Failed to fetch views from Redis, using defaults:", error);
    // Continue with empty views object - posts will show 0 views
  }

  const posts = (postsData.posts as PostData[]).map((post): Post => {
    const views = Number(allViews?.[post.id] ?? 0);
    console.log(`Post ${post.id}: ${views} views`);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  console.log(`Processed ${posts.length} posts`);
  return posts;
};
