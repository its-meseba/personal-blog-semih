import { Caption } from "./caption";
import { CodeBlock } from "./code-block";

/**
 * Two labelled code blocks: side by side on desktop, stacked on a phone.
 * For showing a change - what the code was, what it became - without making
 * the reader diff two separate snippets in their head.
 */
export function CodeCompare({
  before,
  after,
  label = null,
  beforeLabel = "before",
  afterLabel = "after",
}: {
  before: string;
  after: string;
  label?: string | null;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="my-block">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 [&>div]:my-0">
          <CodeBlock filename={beforeLabel}>{before}</CodeBlock>
        </div>
        <div className="min-w-0 [&>div]:my-0">
          <CodeBlock filename={afterLabel}>{after}</CodeBlock>
        </div>
      </div>
      {label != null ? <Caption>{label}</Caption> : null}
    </div>
  );
}
