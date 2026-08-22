import sizeOf from "image-size";
import { join } from "path";
import { readFile } from "fs/promises";
import { Caption } from "./caption";
import { BlogImage as ClientBlogImage } from "./blog-image";

export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
}: {
  src: string;
  alt?: string;
  width: number | null;
  height: number | null;
}) {
  const isDataImage = src.startsWith("data:");
  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ""} />;
  } else {
    if (width === null || height === null) {
      let imageBuffer: Buffer | null = null;

      try {
        if (src.startsWith("http")) {
          const response = await fetch(src);
          if (response.ok) {
            imageBuffer = Buffer.from(await response.arrayBuffer());
          }
        } else {
          if (
            !process.env.CI &&
            process.env.VERCEL_URL &&
            process.env.NODE_ENV === "production"
          ) {
            const response = await fetch("https://" + process.env.VERCEL_URL + src);
            if (response.ok) {
              imageBuffer = Buffer.from(await response.arrayBuffer());
            }
          } else {
            imageBuffer = await readFile(
              new URL(
                join(import.meta.url, "..", "..", "..", "..", "public", src)
              ).pathname
            );
          }
        }

        if (imageBuffer) {
          const computedSize = sizeOf(imageBuffer);
          if (
            computedSize.width !== undefined &&
            computedSize.height !== undefined
          ) {
            width = computedSize.width;
            height = computedSize.height;
          }
        }
      } catch (error) {
        console.error("Error computing image size:", error);
      }

      // Default fallback dimensions for blog images if size couldn't be computed
      if (width === null || height === null) {
        width = 800;
        height = 800;
      }
    }

    let alt: string | null = null;
    let dividedBy = 100;

    if ("string" === typeof originalAlt) {
      const match = originalAlt.match(/(.*) (\[(\d+)%\])?$/);
      if (match != null) {
        alt = match[1];
        dividedBy = match[3] ? parseInt(match[3]) : 100;
      }
    } else {
      alt = originalAlt ?? null;
    }

    const factor = dividedBy / 100;

    return (
      <span className="my-block flex flex-col items-center">
        <ClientBlogImage
          width={width * factor}
          height={height * factor}
          alt={alt ?? ""}
          src={src}
        />

        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }
}
