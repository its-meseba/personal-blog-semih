import Image from "next/image";

/**
 * The post hero.
 *
 * Sits between the byline and the first paragraph, so the page still leads
 * with words. It obeys the vertical-space rule written down in
 * `docs/IMAGES.md`; the two numbers that rule turns on live here:
 *
 * - **Letterboxed, not 3:2.** Source covers are 3:2 (1248x832). Rendered at
 *   3:2 inside the 68ch reading column the image is ~450px tall and shoves the
 *   opening sentence off a laptop screen. The wrapper forces a much wider box
 *   — 2.2:1 on phones, 2.5:1 from `sm` up — and `object-cover` crops to it.
 *   Centred compositions (which the house illustration style mandates) survive
 *   that crop.
 * - **Capped.** `max-h` stops the box growing on wide viewports: 200px on
 *   phones, 340px from `sm` up. At the 68ch measure the aspect ratio is what
 *   binds (~272px); the cap is the guard rail, not the usual case.
 *
 * Zero layout shift by construction: the wrapper's height is a pure function
 * of its own width (aspect-ratio, then the cap), both known before the image
 * byte arrives, so `fill` paints into a box that was already reserved. No
 * `onLoad`, no measured-after-the-fact resizing.
 *
 * Spacing uses the existing rhythm tokens only. Rendering nothing at all when
 * a post has no `cover` is the point of the `{post.cover && ...}` guard at the
 * call site — this component never renders an empty frame.
 */
export function PostCover({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mt-rhythm">
      <div className="relative aspect-[2.2/1] max-h-[200px] w-full overflow-hidden rounded-card border border-border bg-surface sm:aspect-[2.5/1] sm:max-h-[340px]">
        <Image
          src={src}
          alt={alt}
          fill
          // The hero is above the fold on every post: it is the LCP candidate,
          // so it loads eagerly rather than waiting for the lazy observer.
          priority
          sizes="(max-width: 640px) 100vw, 68ch"
          className="object-cover"
        />
      </div>
    </figure>
  );
}
