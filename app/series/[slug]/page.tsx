// Series landing page.
//
// `app/series.ts` owns which series EXIST; `lib/content.ts` owns which posts
// belong to them. A registered series with zero published posts is still a
// real page — it renders an honest empty state rather than 404ing. Only a slug
// that is in no registry at all is a 404.
//
// Note: params come from `getAllSeries()` (the registry), NOT `getSeries()`
// (which is post-derived and silently drops empty series).
//
// The list itself comes from `components/post-list` so this surface and the
// writing index cannot drift apart.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllSeries } from "@/app/series";
import { PostList, type ListPost } from "@/app/components/post-list";
import { getSeriesBySlug } from "@/lib/content";
import { SITE_URL } from "@/lib/post-types";

export const revalidate = 60;

const seriesPath = (slug: string) => `/series/${slug}`;
const seriesFeedPath = (slug: string) => `${seriesPath(slug)}/atom`;

function findSeries(slug: string) {
  return getAllSeries().find(entry => entry.id === slug);
}

/**
 * Published posts in this series, newest first. `getSeriesBySlug` is built
 * from the published index, so drafts can never leak in here.
 */
function publishedPostsFor(slug: string): ListPost[] {
  const posts = getSeriesBySlug(slug)?.posts ?? [];
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    date: post.date,
    year: post.year,
    readTime: post.readTime,
    excerpt: post.excerpt,
    series: post.series,
    status: post.status,
  }));
}

export async function generateStaticParams() {
  return getAllSeries().map(entry => ({ slug: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = findSeries(slug);

  if (!series) {
    return { title: "Series not found" };
  }

  const description =
    series.description ?? `Posts in the ${series.name} series.`;
  const url = `${SITE_URL}${seriesPath(series.id)}`;

  return {
    title: series.name,
    description,
    alternates: {
      canonical: url,
      types: {
        "application/atom+xml": [
          { url: seriesFeedPath(series.id), title: `${series.name} — Atom` },
        ],
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Mehmet Semih Babacan",
      title: series.name,
      description,
    },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = findSeries(slug);

  if (!series) notFound();

  const posts = publishedPostsFor(series.id);

  return (
    <section className="mx-auto w-full max-w-shell pb-chapter">
      <header className="mb-block">
        <p className="tag-console">Series</p>

        <h1 className="mt-2 font-display text-h1 font-semibold tracking-tight text-fg">
          {series.name}
        </h1>

        {series.description && (
          <p className="mt-3 max-w-measure font-serif text-lead text-muted">
            {series.description}
          </p>
        )}

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 meta-mono">
          <span>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
          <span aria-hidden="true">/</span>
          <Link
            href={seriesFeedPath(series.id)}
            className="text-accent transition-colors duration-quick ease-console hover:text-accent-hover"
          >
            Atom feed
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/thoughts"
            className="transition-colors duration-quick ease-console hover:text-fg"
          >
            All writing
          </Link>
        </p>
      </header>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <div className="panel-console">
          <p className="font-serif text-body text-fg">
            Nothing published in this series yet.
          </p>
          <p className="mt-2 font-serif text-body text-muted">
            The first post is still being written. Read{" "}
            <Link
              href="/thoughts"
              className="text-accent underline underline-offset-4 transition-colors duration-quick ease-console hover:text-accent-hover"
            >
              everything else
            </Link>{" "}
            in the meantime, or subscribe to the{" "}
            <Link
              href={seriesFeedPath(series.id)}
              className="text-accent underline underline-offset-4 transition-colors duration-quick ease-console hover:text-accent-hover"
            >
              series feed
            </Link>
            .
          </p>
        </div>
      )}
    </section>
  );
}
