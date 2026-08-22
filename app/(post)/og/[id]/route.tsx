export const revalidate = 60;

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

import { getPublishedPosts, getPost } from "@/lib/content";

// Every published post gets a card, generated from the index — so a post can
// never ship without one again.
export async function generateStaticParams() {
  return getPublishedPosts().map(post => ({ id: post.id }));
}

// Console palette (analysis/blog/design.md, Direction B).
const BG = "#0C0D10";
const SURFACE = "#16181D";
const TEXT = "#E6E8EC";
const MUTED = "#8A9099";
const ACCENT = "#2F81F7";

const SITE_DOMAIN = "semihbabacan.com";

// fonts
const fontsDir = join(process.cwd(), "fonts");

const inter300 = readFileSync(
  join(fontsDir, "inter-latin-300-normal.woff")
);

const inter500 = readFileSync(
  join(fontsDir, "inter-latin-500-normal.woff")
);

const inter600 = readFileSync(
  join(fontsDir, "inter-latin-600-normal.woff")
);

const robotoMono400 = readFileSync(
  join(fontsDir, "roboto-mono-latin-400-normal.woff")
);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = getPost(id);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        tw="flex p-16 h-full w-full flex-col"
        style={{ ...font("Inter 300"), backgroundColor: BG, color: TEXT }}
      >
        <header tw="flex text-[32px] w-full items-center">
          <div style={{ ...font("Roboto Mono 400"), color: ACCENT }}>$</div>
          <div tw="ml-4 font-bold" style={font("Inter 600")}>
            M. Semih Babacan
          </div>
          <div tw="grow" />
          <div tw="text-[26px]" style={{ ...font("Roboto Mono 400"), color: MUTED }}>
            {SITE_DOMAIN}
          </div>
        </header>

        <main tw="flex grow flex-col justify-center">
          {post.series ? (
            <div
              tw="flex text-[24px] uppercase tracking-widest mb-6"
              style={{ ...font("Roboto Mono 400"), color: ACCENT }}
            >
              {post.series}
            </div>
          ) : null}

          <div tw="flex text-[64px] leading-tight" style={font("Inter 500")}>
            {post.title}
          </div>

          <div
            tw="flex mt-10 pt-8 text-[26px]"
            style={{
              ...font("Roboto Mono 400"),
              color: MUTED,
              borderTop: `2px solid ${SURFACE}`,
            }}
          >
            {formatDate(post.date)} · {post.readTime}
          </div>
        </main>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter 300",
          data: inter300,
        },
        {
          name: "Inter 500",
          data: inter500,
        },
        {
          name: "Inter 600",
          data: inter600,
        },
        {
          name: "Roboto Mono 400",
          data: robotoMono400,
        },
      ],
    }
  );
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
