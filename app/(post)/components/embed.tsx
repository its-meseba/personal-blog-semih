import { Caption } from "./caption";

/**
 * Iframes a standalone HTML file served from `/public` - an interactive
 * one-off that was never going to be a React component.
 *
 * IMPORTANT: an iframe contributes NOTHING to the RSS feed, to search
 * engines, or to a reader with scripting off. Always precede an <Embed> with
 * a paragraph that states, in prose, what the thing shows and what the reader
 * is supposed to conclude from it. The embed is the illustration; the text is
 * the article.
 */
export function Embed({
  src,
  title,
  caption = null,
  height = 420,
}: {
  src: string;
  title: string;
  caption?: string | null;
  height?: number;
}) {
  return (
    <figure className="my-block">
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          height={height}
          className="block w-full border-0 bg-background"
          style={{ height: `${height}px` }}
        />
      </div>
      <figcaption>
        <Caption>{caption ?? title}</Caption>
      </figcaption>
    </figure>
  );
}
