export const revalidate = 60;

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

import { getPublishedPosts, getPost } from "@/lib/content";
import { LIGHT } from "@/app/styles/tokens";

// Every published post gets a card, generated from the index — so a post can
// never ship without one again.
export async function generateStaticParams() {
  return getPublishedPosts().map(post => ({ id: post.id }));
}

/**
 * "Fire max" card: a full-bleed orange FIELD with near-black display type on
 * top — case (a) of the contrast rule in `app/styles/tokens.ts` (5.94:1).
 * Nothing on this card is set IN the hot orange; the orange is the ground.
 */
const FIELD = LIGHT.accentField;
const INK = LIGHT.accentInk;
const PAPER = LIGHT.background;

const SITE_DOMAIN = "mehmetsemihbabacan.com";

// Satori needs real font binaries, so the OG cards use the .woff files copied
// into `fonts/` by the postinstall hook rather than the next/font faces.
const fontsDir = join(process.cwd(), "fonts");

const inter300 = readFileSync(join(fontsDir, "inter-latin-300-normal.woff"));

const inter600 = readFileSync(join(fontsDir, "inter-latin-600-normal.woff"));

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
        style={{ ...font("Inter 300"), backgroundColor: FIELD, color: INK }}
      >
        <header tw="flex text-[32px] w-full items-center">
          <div
            tw="flex px-3 py-1"
            style={{
              ...font("Roboto Mono 400"),
              backgroundColor: INK,
              color: PAPER,
            }}
          >
            MSB
          </div>
          <div tw="ml-5" style={font("Inter 600")}>
            M. Semih Babacan
          </div>
          <div tw="grow" />
          <div tw="text-[26px]" style={font("Roboto Mono 400")}>
            {SITE_DOMAIN}
          </div>
        </header>

        <main tw="flex grow flex-col justify-center">
          {post.series ? (
            <div
              tw="flex text-[24px] uppercase tracking-widest mb-6"
              style={font("Roboto Mono 400")}
            >
              {post.series}
            </div>
          ) : null}

          <div tw="flex text-[68px] leading-tight" style={font("Inter 600")}>
            {post.title}
          </div>

          <div
            tw="flex mt-10 pt-8 text-[26px]"
            style={{
              ...font("Roboto Mono 400"),
              borderTop: `3px solid ${INK}`,
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
