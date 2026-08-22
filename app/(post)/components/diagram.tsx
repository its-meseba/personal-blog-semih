import type { ReactNode } from "react";
import { Caption } from "./caption";

/**
 * Wraps hand-written inline SVG so a post can show a mechanism instead of
 * describing it.
 *
 * Contract for the SVG passed as `children`:
 *  - give it a `viewBox` and NO fixed `width`/`height` (this wrapper sizes it)
 *  - colour strokes/fills with `currentColor` or the `--c-*` custom properties
 *    (`stroke="rgb(var(--c-border))"`), never a literal hex - that is what
 *    makes the drawing follow the theme
 *
 * Wide drawings scroll horizontally inside their own container rather than
 * widening the page on a phone: give the SVG a `min-w-[Npx]` class when it
 * genuinely needs the room.
 */
export function Diagram({
  title,
  caption = null,
  children,
}: {
  title: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-block">
      <div
        role="img"
        aria-label={title}
        className="
          overflow-x-auto rounded-card border border-border bg-surface p-4
          text-fg
          [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full
          [&_text:not([fill])]:fill-current [&_text]:font-mono [&_text]:text-[11px]
        "
      >
        {children}
      </div>
      {caption != null ? (
        <figcaption>
          <Caption>{caption}</Caption>
        </figcaption>
      ) : null}
    </figure>
  );
}
