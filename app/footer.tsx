import Link from "next/link";

/**
 * Site footer. Mono, quiet, and the one place the feed is advertised.
 * Wraps to two rows below `sm` instead of overflowing.
 */

const FOOTER_LINK =
  "text-muted transition-colors duration-quick ease-console hover:text-accent";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-shell px-6 pb-block pt-rhythm">
      <div className="flex flex-col gap-2 border-t border-border pt-4 font-mono text-meta text-faint sm:flex-row sm:items-center sm:justify-between">
        <div>
          Mehmet Semih Babacan{" "}
          <a
            className={FOOTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            href="https://x.com/its_meseba"
          >
            @its_meseba
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link className={FOOTER_LINK} href="/atom">
            Atom
          </Link>
          <a
            className={FOOTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/mehmetsemihbabacan"
          >
            LinkedIn
          </a>
          <a
            className={FOOTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/its-meseba"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
