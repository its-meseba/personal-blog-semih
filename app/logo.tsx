"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Wordmark: an accent prompt glyph plus the name in the display face.
 * The glyph is the one branded mark in the chrome (Console, design.md B).
 */
export function Logo() {
  const pathname = usePathname();

  const label = (
    <>
      <span aria-hidden="true" className="font-mono text-accent">
        ~/
      </span>
      <span>M. Semih Babacan</span>
    </>
  );

  const shared =
    "inline-flex items-center gap-1.5 whitespace-nowrap font-display text-ui font-medium tracking-tight sm:text-base";

  return pathname === "/" ? (
    <span className={`${shared} cursor-default pr-2 text-fg`}>{label}</span>
  ) : (
    <Link
      href="/"
      className={`${shared} -ml-2 rounded-sm px-2 py-1.5 text-fg transition-colors duration-quick ease-console hover:bg-surface-hover`}
    >
      {label}
    </Link>
  );
}
