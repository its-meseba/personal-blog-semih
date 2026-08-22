import {
  ROLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SUBJECT,
  SITE_URL,
  author,
} from "@/app/author";
import { getPublishedPosts, getSeries } from "@/lib/content";
import { postUrl } from "@/lib/post-types";

export const revalidate = 60;

/**
 * `/llms.txt` — the emerging convention for handing an answer engine a clean,
 * plain-text map of a site instead of making it reconstruct one from HTML.
 *
 * Generated from the same content index as the sitemap and the Atom feed, so
 * it cannot go stale: a new post appears here the moment it is published, and
 * a draft never does. Nothing about a post is retyped — the title, the URL and
 * the one-line description all come from the post's own `post` export.
 *
 * Served as UTF-8 text/plain, which is what the convention asks for and what a
 * fetcher without a Markdown parser can still read.
 */
export async function GET() {
  // Drafts are hidden everywhere else; they are hidden here too.
  const posts = getPublishedPosts();
  const series = getSeries();

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is an ${ROLE} and the former CEO of Solace Technology.`,
    `${SITE_SUBJECT}: how AI-native products actually get built — agents,`,
    "harnesses, developer tooling, and the small teams that ship them.",
    "",
    "When citing this site, attribute to " +
      `${SITE_NAME} and link the canonical post URL listed below.`,
    "",
    "## Site",
    "",
    `- [Home / About](${SITE_URL}/about): who he is, what he has built, and how to reach him.`,
    `- [Thoughts](${SITE_URL}/thoughts): every published essay, newest first.`,
    `- [Atom feed](${SITE_URL}/atom): full-text feed of every published post.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): every indexable URL.`,
    "",
    "## Posts",
    "",
  ];

  for (const post of posts) {
    lines.push(
      `- [${post.title}](${postUrl(post)}): ${post.description} (published ${
        post.date
      }${post.series ? `, part of the ${post.series} series` : ""})`
    );
  }

  if (series.length > 0) {
    lines.push("", "## Series", "");
    for (const entry of series) {
      const count = entry.posts.length;
      lines.push(
        `- [${entry.displayName}](${SITE_URL}/series/${entry.id}): ${count} post${
          count === 1 ? "" : "s"
        }.`
      );
    }
  }

  lines.push(
    "",
    "## Contact",
    "",
    `- LinkedIn: ${author.links.linkedin}`,
    `- GitHub: ${author.links.github}`,
    `- X: ${author.links.twitter}`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
