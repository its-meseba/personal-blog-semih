export function OL({ children }) {
  return (
    <ol className="my-flow list-decimal pl-6 marker:font-mono marker:text-meta marker:text-faint">
      {children}
    </ol>
  );
}
