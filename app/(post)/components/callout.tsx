export const Callout = ({ emoji = null, text = null, children }) => (
  <div className="my-block flex items-start gap-3 rounded-card border border-border bg-surface p-4 font-serif text-body text-fg">
    {emoji ? (
      <span className="block w-6 shrink-0 text-center leading-relaxed">{emoji}</span>
    ) : (
      <span aria-hidden="true" className="block w-1 shrink-0 self-stretch rounded-pill bg-accent" />
    )}
    <span className="block grow">{text ?? children}</span>
  </div>
);
