import { Header } from "./header";
import { PostFooter } from "./post-footer";
import { getAllPosts } from "../get-posts";
import { ReadingProgress } from "../components/ReadingProgress";

export const revalidate = 60;

/**
 * Post shell. The reading column is the `measure` token (68ch); the masthead
 * and the footer share that same axis so the page has one edge, not three.
 */
export default async function Layout({ children }) {
  // Drafts included: a draft page still needs its masthead (it is `noindex`,
  // not headless). Lists and feeds do their own filtering.
  const posts = await getAllPosts();

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
