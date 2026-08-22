import type { ReactNode } from "react";

/** Pull-quote: accent rule, serif italic, no quotation marks. */
export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-block border-l-2 border-accent pl-5 font-serif text-lead italic text-muted sm:pl-6">
      {children}
    </blockquote>
  );
}
