// Series configuration for blog posts

export type Series = {
  id: string;
  name: string;
  description?: string;
  /**
   * Curated "start here" reading path: published post slugs, in the order
   * a newcomer should read them (3-6 entries — not every post in the
   * series needs a place here). Every slug in `order` MUST have a matching
   * entry in `orderReasons`.
   *
   * Undeclared (or an empty array) means nobody has judged a reading order
   * for this series yet — `lib/content.ts` / the series page fall back to
   * chronological-ascending (oldest post first, no invented reasons)
   * rather than a guessed curriculum. See the per-series comments below
   * for which series actually earned a curated order and why.
   */
  order?: string[];
  /** One-line reason to read each `order` entry, keyed by slug. */
  orderReasons?: Record<string, string>;
};

export const series: Record<string, Series> = {
  Notebook: {
    id: "notebook",
    name: "Notebook",
    description:
      "Personal writing: what living and working through this shift actually feels like",
    // One post. A reading order needs a body of work to order, so this
    // falls back to chronological until there is one.
  },
  "Founder Insights": {
    id: "founder-insights",
    name: "Founder Insights",
    description: "Insights and lessons from the founder journey",
    // No posts exist yet, so there is nothing to order — leave `order`
    // undeclared rather than invent a curriculum for writing that
    // doesn't exist.
  },
  "Tech Deep Dives": {
    id: "tech-deep-dives",
    name: "Tech Deep Dives",
    description: "Technical explorations and engineering insights",
    // Same as above: zero posts, no order to derive.
  },
  "Agentic Coding": {
    id: "agentic-coding",
    name: "Agentic Coding",
    description: "Exploring AI-assisted development and agentic tools",
    // Curated on purpose (2026-08-23), read against the actual post
    // bodies, not guessed from titles. The arc: how you shape an
    // agent's behavior (identity, then a stricter rule system), how you
    // work with one day to day (a spec-driven loop against context
    // rot), how you let one run unattended, how you run several at
    // once, and the operational risk that shows up once you do.
    order: [
      "soul-md",
      "superpowers-skill",
      "get-shit-done",
      "ralph-loop",
      "ruflo-agent-orchestration",
      "agent-identity-crisis",
    ],
    orderReasons: {
      "soul-md":
        "Start with the mechanism underneath everything else here: an identity file changes an agent's defaults, which does more than a better-worded prompt.",
      "superpowers-skill":
        "The same idea taken further — a rule system that assumes suggestions do nothing, with a hook that reinstalls itself after compaction.",
      "get-shit-done":
        "The day-to-day workflow this enables: a spec-driven loop built to survive context rot instead of hoping a bigger window fixes it.",
      "ralph-loop":
        "What happens once that loop is reliable enough to run unattended overnight.",
      "ruflo-agent-orchestration":
        "What happens once one agent isn't enough — coordinating several turns out to be a state problem, not a prompting problem.",
      "agent-identity-crisis":
        "The operational risk that shows up once agents are actually running: none of them have their own identity, and the audit log knows it.",
    },
  },
  "AI Product Sense": {
    id: "ai-product-sense",
    name: "AI Product Sense",
    description:
      "Judgement calls about building AI products: what to ship, what to charge for, what agents change",
    // One published post — nothing to order yet. Falls back to
    // chronological-ascending, which for one post is a no-op.
  },
};

export const getSeriesConfig = (seriesName?: string): Series | undefined => {
  if (!seriesName) return undefined;
  return series[seriesName];
};

export const getAllSeries = (): Series[] => {
  return Object.values(series);
};
