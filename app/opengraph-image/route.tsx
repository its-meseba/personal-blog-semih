export const revalidate = 60;

import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";
import { readFileSync } from "fs";
import { join } from "path";

import { LIGHT } from "@/app/styles/tokens";

/**
 * "Fire max" index card: cream paper, near-black ink, and one full-bleed
 * orange FIELD as the masthead — case (a) of the contrast rule in
 * `app/styles/tokens.ts`. The orange never carries small type.
 */
const PAPER = LIGHT.background;
const INK = LIGHT.text;
const MUTED = LIGHT.muted;
const FIELD = LIGHT.accentField;
const FIELD_INK = LIGHT.accentInk;
const RULE = LIGHT.borderStrong;

const fontsDir = join(process.cwd(), "fonts");

const inter300 = readFileSync(
  join(fontsDir, "inter-latin-300-normal.woff")
);

const inter600 = readFileSync(
  join(fontsDir, "inter-latin-600-normal.woff")
);

const robotoMono400 = readFileSync(
  join(fontsDir, "roboto-mono-latin-400-normal.woff")
);

export async function GET() {
  const posts = await getPosts();

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col"
        style={{ ...font("Inter 300"), backgroundColor: PAPER, color: INK }}
      >
        <header
          tw="flex text-[36px] w-full items-center px-10 py-8"
          style={{ backgroundColor: FIELD, color: FIELD_INK }}
        >
          <div style={font("Inter 600")}>M. Semih Babacan</div>
          <div tw="grow" />
          <div tw="text-[28px]" style={font("Roboto Mono 400")}>
            semihbabacan.com
          </div>
        </header>

        <main
          tw="flex px-10 pt-10 pb-10 flex-col w-full"
          style={font("Roboto Mono 400")}
        >
          <div tw="flex w-full text-[26px] mb-3" style={{ color: MUTED }}>
            <div tw="w-24">date</div>
            <div tw="grow">title</div>
            <div>views</div>
          </div>

          {posts.map((post, i) => (
            <div
              key={post.id}
              tw="flex py-6 text-[26px] border-t w-full"
              style={{ borderColor: RULE }}
            >
              <div tw="flex w-24" style={{ color: MUTED }}>
                {posts[i - 1] === undefined ||
                  getYear(post.date) !== getYear(posts[i - 1].date)
                  ? getYear(post.date)
                  : ""}
              </div>
              <div tw="flex grow">{post.title}</div>
              <div tw="flex pl-7" style={{ color: MUTED }}>
                {post?.viewsFormatted}
              </div>
            </div>
          ))}
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

// lil helper to convert posts.json `date` to full year
function getYear(date: string) {
  return new Date(date).getFullYear();
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
