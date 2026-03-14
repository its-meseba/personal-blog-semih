export function Table({ children }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }) {
  return <tr className="border-b border-gray-200">{children}</tr>;
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-700">
      {children}
    </td>
  );
}