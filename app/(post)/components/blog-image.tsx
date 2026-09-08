"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

interface BlogImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const PORTRAIT_THRESHOLD = 1;
/** A portrait image is capped by height so a phone screenshot does not become a wall. */
const PORTRAIT_MAX_HEIGHT = "min(70vh, 640px)";

/**
 * Responsive blog image: landscape fills the reading column, portrait is
 * capped by height, and either opens full-size in a native `<dialog>`.
 */
export function BlogImage({ src, alt, width, height, className = "" }: BlogImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isPortrait = height / width > PORTRAIT_THRESHOLD;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`View full size: ${alt}`}
        className="relative block w-full cursor-zoom-in rounded-card border-0 bg-transparent p-0"
      >
        {isLoading && (
          <span
            className="absolute inset-0 animate-pulse rounded-card bg-surface motion-reduce:animate-none"
            style={{ aspectRatio: `${width}/${height}` }}
          />
        )}
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 68ch"
          className={`mx-auto h-auto rounded-card ${className} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-base ease-console ${
            isPortrait ? "w-auto" : "w-full"
          }`}
          style={isPortrait ? { maxHeight: PORTRAIT_MAX_HEIGHT } : undefined}
          onLoad={() => setIsLoading(false)}
        />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out bg-transparent p-0 backdrop:bg-black/85"
      >
        {isOpen ? (
          <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
            <NextImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              className="h-auto max-h-full w-auto max-w-full rounded-card object-contain"
              onClick={() => setIsOpen(false)}
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
