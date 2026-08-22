import { getPublishedPosts } from "@/lib/content";
import { ATOM_CONTENT_TYPE, buildAtomFeed } from "@/lib/feed";
import { author } from "@/app/author";

export const revalidate = 60;

export async function GET() {
  // Drafts never syndicate.
  const posts = getPublishedPosts();

  return new Response(
    buildAtomFeed(posts, {
      selfPath: "/atom",
      alternatePath: "/thoughts",
      title: author.name,
      subtitle: "Essays on AI products, agents and building software",
    }),
    {
      headers: {
        "Content-Type": ATOM_CONTENT_TYPE,
      },
    }
  );
}
