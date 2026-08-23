"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { author } from "../author";

interface AuthorCardProps {
  showBio?: boolean;
  date?: string;
  readTime?: string;
  /** Formatted "last modified" date, shown only when it differs from `date`. */
  updated?: string;
  /** Extra meta appended to the mono line (the view counter, today). */
  children?: ReactNode;
}

/**
 * Byline. One mono meta line, separated by slashes rather than a run of
 * middle dots, so date / read time / updated / views read as one field group.
 */
export function AuthorCard({
  showBio = false,
  date,
  readTime,
  updated,
  children,
}: AuthorCardProps) {
  return (
    <div className="mt-rhythm flex items-center gap-3">
      <Image
        src="/images/photo.jpeg"
        alt={author.name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-pill border border-border object-cover"
        priority
      />

      <div className="min-w-0">
        <Link
          href="/about"
          className="font-display text-ui font-medium text-fg transition-colors duration-quick ease-console hover:text-accent"
        >
          {author.name}
        </Link>

        {/* The positioning, on every byline — not just the about page. */}
        <p className="font-serif text-caption text-muted">{author.role}</p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-meta tabular-nums text-faint">
          {date && <span>{date}</span>}
          {date && readTime && <span aria-hidden="true">/</span>}
          {readTime && <span>{readTime}</span>}
          {(date || readTime) && updated && <span aria-hidden="true">/</span>}
          {updated && <span>Updated {updated}</span>}
          {children && <span aria-hidden="true">/</span>}
          {children}
        </div>

        {showBio && (
          <p className="mt-1 font-serif text-caption text-muted">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
}
