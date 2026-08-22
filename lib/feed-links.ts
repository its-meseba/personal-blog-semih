// Feed autodiscovery, in one place.
//
// Next replaces `alternates` wholesale when a page declares its own, so any
// page that sets a canonical silently drops the site-wide
// `<link rel="alternate" type="application/atom+xml">` from the root layout.
// Every such page spreads `atomAlternateTypes()` instead of re-typing the
// literal, so the feed cannot go missing from a surface again.

import type { Metadata } from "next";

import { author } from "@/app/author";

export const SITE_ATOM_PATH = "/atom";

type AlternateTypes = NonNullable<NonNullable<Metadata["alternates"]>["types"]>;

/**
 * The site feed, plus an optional narrower one (a series feed). Readers offer
 * both; the site feed is always first because it is the complete archive.
 */
export function atomAlternateTypes(
  extra?: { url: string; title: string },
): AlternateTypes {
  const feeds = [{ url: SITE_ATOM_PATH, title: `${author.name} — Atom` }];
  if (extra) feeds.push(extra);
  return { "application/atom+xml": feeds };
}
