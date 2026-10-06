import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// The `revalidate = 60` pages show live view counts from Firebase, so the
// incremental cache must be writable. KV, not R2: OpenNext uploads the KV cache
// with `wrangler kv bulk put`, while its R2 upload path goes through a
// temporary worker that kept failing with 500s on this account.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: memoryQueue,
});
