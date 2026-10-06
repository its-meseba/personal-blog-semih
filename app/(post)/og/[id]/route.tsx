export const revalidate = 60;

import { ImageResponse } from "next/og";

import { getPublishedPosts, getPost } from "@/lib/content";
import { inter300, inter600, robotoMono400 } from "@/lib/generated/og-fonts";
import { LIGHT } from "@/app/styles/tokens";

// Every published post gets a card, generated from the index — so a post can
// never ship without one again.
export async function generateStaticParams() {
  return getPublishedPosts().map(post => ({ id: post.id }));
}

/** Burgundy share card with contrasting paper text from the brand palette. */
const FIELD = LIGHT.accentField;
const INK = LIGHT.accentInk;
const PAPER = LIGHT.background;

const SITE_DOMAIN = "mehmetsemihbabacan.com";

// Satori needs real font binaries. Workers has no filesystem, so the .woff
// files are embedded as base64 by `scripts/build-content.ts` and decoded once.
const fromBase64 = (data: string) => Buffer.from(data, "base64");
const INTER_300 = fromBase64(inter300);
const INTER_600 = fromBase64(inter600);
const ROBOTO_MONO_400 = fromBase64(robotoMono400);

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
          data: INTER_300,
        },
        {
          name: "Inter 600",
          data: INTER_600,
        },
        {
          name: "Roboto Mono 400",
          data: ROBOTO_MONO_400,
        },
      ],
    }
  );
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
