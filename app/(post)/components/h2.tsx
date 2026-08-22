import { withHeadingId } from "./utils";

/**
 * Section break. The rule above the heading is the rhythm signal: it is what
 * makes a long post scannable without a table of contents.
 */
export function H2({ children }) {
  return (
    <h2 className="group relative mb-rhythm mt-section border-t border-border pt-rhythm font-display text-h2 font-semibold text-fg">
      {withHeadingId(children)}
    </h2>
  );
}
