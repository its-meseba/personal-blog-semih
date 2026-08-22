import type { ReactNode } from "react";
import { Caption } from "./caption";
import { Image } from "./image";

/**
 * An image with a caption.
 *
 * Two shapes, both supported:
 *  - `<Figure src="/x.png" alt="..." caption="..." />` - the common case
 *  - `<Figure wide>{children}</Figure>` - wrap anything (a chart, a table)
 *    in the same framed, captioned block
 *
 * `alt` is what a screen reader gets; `caption` is what everyone reads. They
 * are different jobs, so write both - if `caption` is omitted the caption line
 * is simply dropped, `alt` is never printed as a caption.
 */
export async function Figure({
  src = null,
  alt = "",
  caption = null,
  wide = false,
  children = null,
}: {
  src?: string | null;
  alt?: string;
  caption?: ReactNode;
  wide?: boolean;
  children?: ReactNode;
}) {
  // `Image` is an async server component; TS 4.9 cannot type one in JSX
  // position, so it is awaited as a plain function instead.
  const body =
    src != null ? await Image({ src, alt, showCaption: false }) : children;

  return (
    <figure
      className={`my-block overflow-hidden text-center ${
        wide ? "rounded-card border border-border bg-surface p-4" : ""
      }`}
    >
      {body}
      {caption != null ? (
        <figcaption>
          <Caption>{caption}</Caption>
        </figcaption>
      ) : null}
    </figure>
  );
}
