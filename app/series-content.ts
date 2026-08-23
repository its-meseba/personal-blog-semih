// Series pillar-page introductions, in Semih's own words.
//
// This is content, not configuration, so it lives apart from `app/series.ts`
// (the registry) — an intro is prose written after reading every post in the
// series, not a field someone fills in when a series is created.
//
// Only series with actual posts get an entry here. A series that exists in
// the registry but has nothing published (Founder Insights, Tech Deep
// Dives) has nothing to introduce yet — the page's existing empty state
// already says so honestly; adding intro copy on top of it would be the
// pretend-guide problem this whole page redesign is trying to avoid.

/** Series id → intro paragraphs, rendered as separate `<p>` blocks. */
export const SERIES_INTRO: Record<string, string[]> = {
  "agentic-coding": [
    "I ship code with an agent doing most of the typing now, and I write this series because the tools change faster than anyone's advice about them. Most agentic coding content is either a vendor pitch or a doom post. I want the third thing: what actually changes how I work, tested against my own repos, not a demo.",
    "The pattern across these posts is that the interesting decisions live outside the model. An identity file changes defaults more than a better prompt does. A hook that reinstalls rules after compaction matters more than a longer system message. Orchestrating five agents is a state problem, not a prompting problem, and I say so even while arguing that most teams reach for the heavy version too early. I also cover the boring stuff that gets ignored: agents authenticating as me instead of as themselves, and why cheaper, smaller models already beat the expensive ones on the benchmarks that matter for coding.",
    "None of this is theory. Every post here comes from a tool I installed, read the source of, or ran against real work.",
  ],
  "ai-product-sense": [
    "This series is one post right now, and I'd rather say that plainly than dress up an empty page. AI Product Sense is where I put judgment calls that sit above the code: what to ship, what to charge for, what an agent actually changes about a product. Calls that don't show up in a benchmark table.",
    "The post here, on DeepSeek's open-sourced agent harness, is the shape the rest will take. The model DeepSeek released is not the interesting part. The program wrapping it, the loop, the tools, the rules about what the agent is allowed to touch, is where the product decisions actually live, and those are the same decisions anyone shipping an LLM feature has to make whether they notice or not. I read the repo package by package instead of taking the announcement at face value.",
    "More lands here as I make more of these calls.",
  ],
};
