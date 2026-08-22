import type { ReactNode } from "react";

/**
 * A large display-type quote. Its job is to break a long stretch of prose and
 * give the eye somewhere to land, so it sits on its own rhythm and does not
 * borrow the blockquote styling used for real citations.
 */
export function PullQuote({
  children,
  cite = null,
}: {
  children: ReactNode;
  cite?: ReactNode;
}) {
  return (
    <figure className="my-section border-l-2 border-accent pl-5 sm:pl-6">
      <blockquote className="font-display text-h3 font-semibold leading-snug tracking-tight text-fg [text-wrap:balance] sm:text-h2 [&_p]:my-0 [&_p]:font-display [&_p]:text-h3 [&_p]:font-semibold [&_p]:sm:text-h2">
        {children}
      </blockquote>
      {cite != null ? (
        <figcaption className="mt-3 font-mono text-meta uppercase tracking-tag text-faint">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
