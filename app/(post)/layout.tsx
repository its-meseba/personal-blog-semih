import { Header } from "./header";
import { getPosts } from "../get-posts";
import { ReadingProgress } from "../components/ReadingProgress";

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = await getPosts();

  return (
    <>
      <ReadingProgress />
      <article className="text-gray-800 dark:text-gray-300 mb-10 max-w-[680px] mx-auto">
        <Header posts={posts} />
        <div className="prose-content">
          {children}
        </div>
      </article>
    </>
  );
}
