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
// A series with posts is a pillar page, not just a list: it carries a written
// intro (`app/series-content.ts`, only for series someone has actually read
// and written about) and a reading order (`getSeriesReadingPlan`, curated via
// `app/series.ts`'s `order` field or a chronological-ascending fallback). The
// list itself still comes from `components/post-list` so this surface and the
// writing index cannot drift apart.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllSeries } from "@/app/series";
import { atomAlternateTypes } from "@/lib/feed-links";
import { PostList, type ListPost } from "@/app/components/post-list";
import { getSeriesBySlug, getSeriesReadingPlan } from "@/lib/content";
import { OG_DEFAULT_IMAGE, SITE_URL, type IndexedPost } from "@/lib/post-types";
import { SERIES_INTRO } from "@/app/series-content";
import { JsonLd } from "@/app/components/JsonLd";
import {
  breadcrumbSchema,
  seriesBreadcrumb,
  seriesCollectionSchema,
} from "@/app/structured-data";

export const revalidate = 60;

const seriesPath = (slug: string) => `/series/${slug}`;
const seriesFeedPath = (slug: string) => `${seriesPath(slug)}/atom`;

function findSeries(slug: string) {
  return getAllSeries().find(entry => entry.id === slug);
}

function toListPost(post: IndexedPost): ListPost {
  return {
    id: post.id,
    title: post.title,
    date: post.date,
    year: post.year,
    readTime: post.readTime,
    excerpt: post.excerpt,
    series: post.series,
    status: post.status,
  };
}

/**
 * Whether `/series/<slug>/atom` will actually serve. That route is built from
 * `getSeries()` (post-derived), so an empty series has no feed to link to.
 */
function hasFeed(slug: string): boolean {
  return (getSeriesBySlug(slug)?.posts.length ?? 0) > 0;
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
      // The site feed is always advertised. The series atom route is
      // post-derived and 404s for an empty series, so that one is added only
      // once there is something to syndicate.
      types: atomAlternateTypes(
        hasFeed(series.id)
          ? { url: seriesFeedPath(series.id), title: `${series.name} — Atom` }
          : undefined,
      ),
    },
    // Declaring `openGraph` here replaces the root one wholesale, images
    // included — so the site-wide card has to be restated.
    openGraph: {
      type: "website",
      url,
      siteName: "Mehmet Semih Babacan",
      title: series.name,
      description,
      images: [
        {
          url: OG_DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: series.name,
        },
      ],
    },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const registryEntry = findSeries(slug);

  if (!registryEntry) notFound();

  const seriesWithPosts = getSeriesBySlug(slug);
  const posts = seriesWithPosts?.posts ?? [];
  const url = `${SITE_URL}${seriesPath(registryEntry.id)}`;
  const intro = SERIES_INTRO[registryEntry.id];

  // Reading order needs the post-derived series (`getSeriesBySlug`), not the
  // bare registry entry — `order`/`orderReasons` live on both (the registry
  // entry is spread into it), but only the post-derived one carries `posts`.
  const plan = seriesWithPosts
    ? getSeriesReadingPlan(seriesWithPosts)
    : { startHere: [], rest: [], isCurated: false };

  const orderedPosts = [
    ...plan.startHere.map(entry => entry.post),
    ...plan.rest,
  ];

  return (
    <section className="mx-auto w-full max-w-shell pb-chapter">
      <JsonLd
        data={seriesCollectionSchema(registryEntry, url, orderedPosts)}
      />
      <JsonLd
        data={breadcrumbSchema(seriesBreadcrumb(registryEntry.name, url))}
      />

      <header className="mb-block">
        <p className="tag-console">Series</p>

        <h1 className="mt-2 font-display text-h1 font-semibold tracking-tight text-fg">
          {registryEntry.name}
        </h1>

        {registryEntry.description && (
          <p className="mt-3 max-w-measure font-serif text-lead text-muted">
            {registryEntry.description}
          </p>
        )}

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 meta-mono">
          <span>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
          {posts.length > 0 && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={seriesFeedPath(registryEntry.id)}
                className="text-accent transition-colors duration-quick ease-console hover:text-accent-hover"
              >
                Atom feed
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <Link
            href="/thoughts"
            className="transition-colors duration-quick ease-console hover:text-fg"
          >
            All writing
          </Link>
        </p>
      </header>

      {posts.length === 0 ? (
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
            in the meantime. This series gets its own feed once the first post
            lands.
          </p>
        </div>
      ) : (
        <>
          {intro && (
            <div className="mb-block max-w-measure space-y-4">
              {intro.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-serif text-body leading-relaxed text-fg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {plan.isCurated ? (
            <>
              <h2 className="mb-4 font-mono text-meta uppercase tracking-tag text-faint">
                Start here
              </h2>
              <ol className="mb-block space-y-4">
                {plan.startHere.map((entry, index) => (
                  <li key={entry.post.id} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 font-mono text-meta tabular-nums text-faint"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/${entry.post.year}/${entry.post.id}`}
                        className="font-display text-h4 font-medium leading-snug tracking-tight text-fg transition-colors duration-quick ease-console hover:text-accent"
                      >
                        {entry.post.title}
                      </Link>
                      {entry.reason && (
                        <p className="mt-1 font-serif text-ui leading-relaxed text-muted">
                          {entry.reason}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {plan.rest.length > 0 && (
                <>
                  <h2 className="mb-2 font-mono text-meta uppercase tracking-tag text-faint">
                    More in this series
                  </h2>
                  <PostList
                    posts={plan.rest.map(toListPost)}
                    withLead={false}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="mb-4 font-mono text-meta uppercase tracking-tag text-faint">
                In publication order
              </h2>
              <p className="mb-4 max-w-measure font-serif text-ui text-muted">
                Nobody has laid out a reading path for this series yet, so
                these are listed oldest first — the order they were written
                in, not a curated one.
              </p>
              <ol className="space-y-3">
                {plan.startHere.map((entry, index) => (
                  <li key={entry.post.id} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 font-mono text-meta tabular-nums text-faint"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/${entry.post.year}/${entry.post.id}`}
                      className="font-display text-h4 font-medium leading-snug tracking-tight text-fg transition-colors duration-quick ease-console hover:text-accent"
                    >
                      {entry.post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </section>
  );
}
