export function Table({ children }) {
  // The wrapper is what keeps a wide table from pushing the page sideways at 360px.
  return (
    <div className="my-block -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <table className="min-w-full border-collapse text-left font-display text-ui">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="bg-surface">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }) {
  return <tr className="border-b border-border last:border-b-0">{children}</tr>;
}

export function Th({ children }) {
  return (
    <th className="whitespace-nowrap px-3 py-2.5 font-mono text-meta uppercase tracking-tag text-muted">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return <td className="px-3 py-2.5 align-top text-fg">{children}</td>;
}
