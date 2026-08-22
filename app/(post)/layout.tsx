import { Header } from "./header";
import { PostFooter } from "./post-footer";
import { getPosts } from "../get-posts";
import { ReadingProgress } from "../components/ReadingProgress";

export const revalidate = 60;

/**
 * Post shell. The reading column is the `measure` token (68ch); the masthead
 * and the footer share that same axis so the page has one edge, not three.
 */
export default async function Layout({ children }) {
  // Published only. `Header` and `PostFooter` are client components, so this
  // array is serialised into every post page’s flight payload: sending
  // `getAllPosts()` published every draft title and standfirst in the HTML of
  // every published post. A draft page resolves its own post client-side
  // through `/api/view` (see `useCurrentPost`), so it still renders.
  const posts = await getPosts();

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto w-full max-w-measure pb-chapter">
        <Header posts={posts} />

        <article className="prose-console">{children}</article>

        <PostFooter posts={posts} />
      </div>
    </>
  );
}
