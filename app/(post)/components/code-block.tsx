"use client";

import { useRef, useState, type ReactNode } from "react";

const RESET_MS = 1600;

/**
 * The code block is the material this blog is read for, so it gets a real
 * frame: an optional filename strip, a copy button, and a scroll container
 * that keeps long lines from widening the page on a phone.
 */
export function CodeBlock({
  children,
  filename = null,
  scroll = true,
}: {
  children: ReactNode;
  filename?: string | null;
  scroll?: boolean;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), RESET_MS);
    } catch {
      // Clipboard is unavailable (insecure context, denied permission).
      // Selecting the text by hand still works, so fail quietly.
      setCopied(false);
    }
  };

  return (
    <div className="my-block overflow-hidden rounded-code border border-border bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <span className="truncate font-mono text-meta text-faint">
          {filename ?? ""}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-sm px-2 py-1 font-mono text-meta uppercase tracking-tag text-muted transition-colors duration-quick ease-console hover:bg-surface-hover hover:text-accent"
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre
        ref={preRef}
        className={`px-4 py-3.5 font-mono text-caption leading-relaxed text-fg ${
          scroll ? "overflow-x-auto" : "overflow-hidden whitespace-pre-wrap break-words"
        }`}
      >
        {children}
      </pre>
    </div>
  );
}
