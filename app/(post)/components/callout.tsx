import type { ReactNode } from "react";

export type CalloutKind = "note" | "warning" | "aside";

/**
 * A bordered panel for something that sits beside the argument: a caveat, a
 * warning, an aside the reader can skip.
 *
 * `kind` sets the accent rail and the label; an explicit `emoji` replaces the
 * rail when a post wants its own marker.
 */
const KIND: Record<CalloutKind, { label: string; rail: string; text: string }> = {
  note: { label: "Note", rail: "bg-accent-mark", text: "text-accent" },
  warning: { label: "Warning", rail: "bg-fg", text: "text-fg" },
  aside: { label: "Aside", rail: "bg-border-strong", text: "text-muted" },
};

export const Callout = ({
  kind = "note",
  emoji = null,
  text = null,
  label = null,
  children,
}: {
  kind?: CalloutKind;
  emoji?: ReactNode;
  text?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
}) => {
  const tone = KIND[kind] ?? KIND.note;
  const heading = label ?? (kind === "note" ? null : tone.label);

  return (
    <aside className="my-block flex items-start gap-3 rounded-card border border-border bg-surface p-4 font-serif text-body text-fg">
      {emoji ? (
        <span className="block w-6 shrink-0 text-center leading-relaxed">{emoji}</span>
      ) : (
        <span
          aria-hidden="true"
          className={`block w-1 shrink-0 self-stretch rounded-pill ${tone.rail}`}
        />
      )}
      <div className="grow">
        {heading != null ? (
          <span
            className={`mb-1 block font-mono text-meta uppercase tracking-tag ${tone.text}`}
          >
            {heading}
          </span>
        ) : null}
        <span className="block [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {text ?? children}
        </span>
      </div>
    </aside>
  );
};
