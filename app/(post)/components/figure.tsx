export function Figure({ wide = false, children }) {
  return (
    <div
      className={`my-block overflow-hidden text-center ${
        wide ? "rounded-card border border-border bg-surface p-4" : ""
      }`}
    >
      {children}
    </div>
  );
}
