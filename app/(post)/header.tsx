"use client";

import { useEffect, useRef } from "react";

import type { Post } from "@/app/get-posts";
import { useCurrentPost } from "./use-current-post";
import { SeriesTag } from "@/app/components/SeriesBadge";
import { AuthorCard } from "@/app/components/AuthorCard";
import { PostCover } from "@/app/components/PostCover";
import { JsonLd } from "@/app/components/JsonLd";
import {
  blogPostingSchema,
  breadcrumbSchema,
  postBreadcrumb,
} from "@/app/structured-data";

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Post masthead: series, title, standfirst, then one mono meta line.
 * Everything above the first paragraph, and nothing else.
 */
export function Header({ posts }: { posts: Post[] }) {
  const { post, mutate } = useCurrentPost(posts, { refreshInterval: 5000 });

  if (post == null) return <></>;

  // "Updated" renders only when the AUTHOR declared a revision (`updated` in
  // the post's metadata). `dateModified` falls back to `date`, so an
  // undeclared post shows no Updated line at all — which is every post that
  // has merely been reformatted, re-tagged or migrated.
  const wasModified = post.dateModified !== post.date;

  // A draft is `noindex` and absent from the sitemap and /llms.txt, so it gets
  // no structured data either: markup that says "published article" about a
  // page we are asking crawlers to ignore is a contradiction.
  const indexable = post.status !== "draft";

  return (
    <header className="mb-block border-b border-border pb-rhythm">
      {indexable && (
        <>
          {/* Rendered here because this is the only component that knows which
              post the route is showing. It resolves during SSR, so the markup
              is in the served HTML, not added later by JavaScript. */}
          <JsonLd data={blogPostingSchema(post)} />
          <JsonLd data={breadcrumbSchema(postBreadcrumb(post))} />
        </>
      )}
      {(post.series || post.status === "draft") && (
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          {post.series && <SeriesTag series={post.series} size="md" />}
          {post.status === "draft" && (
            <span className="rounded-xs border border-border-strong px-1.5 py-0.5 font-mono text-micro uppercase tracking-tag text-faint">
              Draft
            </span>
          )}
        </div>
      )}

      {/* `vt-post-title` names this heading for the View Transitions API, so a
          cross-document navigation morphs the title instead of cross-fading it
          with the rest of the page. Unique per document by construction: one
          masthead per post. */}
      <h1 className="vt-post-title font-display text-h1 font-semibold leading-tight tracking-tight text-fg sm:text-display">
        {post.title}
      </h1>

      {post.description && (
        <p className="mt-4 font-serif text-lead text-muted">
          {post.description}
        </p>
      )}

      <AuthorCard
        date={formatDate(post.date)}
        readTime={post.readTime}
        updated={wasModified ? formatDate(post.dateModified) : undefined}
      >
        <Views
          id={post.id}
          mutate={mutate}
          defaultValue={post.viewsFormatted}
        />
      </AuthorCard>

      {/* After the words, before the prose — see `docs/IMAGES.md`. A post
          without a cover renders nothing here, not an empty frame. */}
      {post.cover && <PostCover src={post.cover} alt={post.title} />}
    </header>
  );
}

function Views({ id, mutate, defaultValue }) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if (!didLogViewRef.current) {
      const url = "/api/view?incr=1&id=" + encodeURIComponent(id);
      fetch(url)
        .then(res => res.json())
        .then(obj => {
          mutate(obj);
        })
        .catch(console.error);
      didLogViewRef.current = true;
    }
  });

  return views != null ? <span>{views} views</span> : null;
}
