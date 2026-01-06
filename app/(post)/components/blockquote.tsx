import type { ReactNode } from "react";

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      className="my-10 text-[24px] leading-[1.6] italic pl-8 border-l-[3px] border-green-600 dark:border-green-500 text-gray-600 dark:text-gray-400"
      style={{ fontFamily: 'Georgia, Cambria, serif' }}
    >
      {children}
    </blockquote>
  );
}
