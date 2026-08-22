import type { ReactNode } from "react";

/**
 * An ordered list whose counters are monospaced and sit in the margin, for
 * procedures the reader is meant to follow in order.
 *
 * Use with `<Step>` children so the numbering is explicit:
 *   <Steps><Step title="...">...</Step></Steps>
 */
export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="my-block list-none space-y-5 border-l border-border pl-0 [counter-reset:step]">
      {children}
    </ol>
  );
}

export function Step({
  title = null,
  children,
}: {
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <li
      className="
        relative pl-12 [counter-increment:step]
        before:absolute before:left-0 before:top-0 before:flex before:h-7 before:w-7
        before:-translate-x-1/2 before:items-center before:justify-center
        before:rounded-pill before:border before:border-border before:bg-surface
        before:font-mono before:text-meta before:text-accent
        before:content-[counter(step)]
      "
    >
      {title != null ? (
        <span className="mb-1 block font-display text-h4 font-semibold tracking-tight text-fg">
          {title}
        </span>
      ) : null}
      <span className="block font-serif text-body text-fg [&>p]:my-2 [&>p:first-child]:mt-0">
        {children}
      </span>
    </li>
  );
}
