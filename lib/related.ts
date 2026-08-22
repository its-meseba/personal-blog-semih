// Related posts: same series first, then tag overlap, then recency.
//
// Pure ranking over the generated index — no I/O — so it runs on the server
// page or in the client post footer without a second data source.

export type RelatedCandidate = {
  id: string;
  date: string;
  series?: string;
  tags?: string[];
  status?: string;
};

const SERIES_WEIGHT = 100;
const TAG_WEIGHT = 10;

export const DEFAULT_RELATED_COUNT = 3;

function score(post: RelatedCandidate, current: RelatedCandidate): number {
  let value = 0;

  if (current.series && post.series === current.series) {
    value += SERIES_WEIGHT;
  }

  const currentTags = new Set(current.tags ?? []);
  for (const tag of post.tags ?? []) {
    if (currentTags.has(tag)) value += TAG_WEIGHT;
  }

  return value;
}

/**
 * Ranked neighbours of `current`. Drafts are never suggested: a related link
 * is a recommendation, and a draft is not ready to be recommended.
 */
export function relatedPosts<T extends RelatedCandidate>(
  current: RelatedCandidate,
  all: T[],
  count: number = DEFAULT_RELATED_COUNT
): T[] {
  return all
    .filter(post => post.id !== current.id && post.status !== "draft")
    .map(post => ({ post, value: score(post, current) }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return Date.parse(b.post.date) - Date.parse(a.post.date);
    })
    .slice(0, count)
    .map(entry => entry.post);
}
