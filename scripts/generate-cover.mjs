#!/usr/bin/env node
// Generate one post cover in the house illustration style.
//
//   node scripts/generate-cover.mjs <slug> "<subject: objects and arrangement>"
//
// Writes <OUT_DIR>/<slug>.png (default /tmp/covers). Optimise and install it
// with the cwebp command documented in docs/IMAGES.md — this script
// deliberately does NOT write into public/, because every generated image
// must be eyeballed for stray text first (docs/IMAGES.md §2.4, Rule 1).
//
// Auth: a service-account key, never a user token. Workspace reauth expires
// user tokens mid-batch and the failure reads like a permissions error.
//
//   gcloud auth activate-service-account \
//     --key-file=~/dev/work/lumio-studio/assets/gcloud/data-ops-lumio-sa.json

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT = "botcu-lumio";
const LOCATION = "global";
const MODEL = "gemini-2.5-flash-image";
// `:generateContent`, NOT `:predict` — :predict is the Imagen-style endpoint
// and returns HTTP 400 for Gemini image models.
const ENDPOINT = `https://aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;
const SERVICE_ACCOUNT = "data-ops@botcu-lumio.iam.gserviceaccount.com";
const ASPECT_RATIO = "3:2";
const OUT_DIR = process.env.OUT_DIR ?? "/tmp/covers";

/** The approved style string. Keep verbatim; see docs/IMAGES.md §2.2. */
const STYLE = [
  "Flat vector product-marketing illustration, soft warm gradient background",
  "from cream to pale peach, flat shapes with thin near-black outlines,",
  "generous rounded corners, soft drop shadows, lots of white space, centred",
  "composition, single accent colour #FF5A1F used on only two or three small",
  "elements, everything else neutral warm grey and off-white, no people, no",
  "photography, no 3D rendering, clean modern editorial style.",
  "ABSOLUTELY NO TEXT: no words, no letters, no numbers, no labels, no",
  "captions, no logos, no watermarks, no colour codes, no UI copy anywhere",
  "in the image.",
].join(" ");

function buildPrompt(subject) {
  return `${subject.replace(/\.?$/, ".")} ${STYLE}`;
}

/**
 * An access token for the service account. `--account` is passed per command
 * so the machine-wide active gcloud account is never mutated — parallel
 * agent sessions share that state and clobber each other's identity.
 */
function accessToken() {
  return execFileSync(
    "gcloud",
    ["auth", "print-access-token", `--account=${SERVICE_ACCOUNT}`],
    { encoding: "utf8" }
  ).trim();
}

async function generate(slug, subject) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(subject) }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: ASPECT_RATIO },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Vertex AI ${response.status}: ${(await response.text()).slice(0, 800)}`
    );
  }

  const parts = (await response.json())?.candidates?.[0]?.content?.parts ?? [];
  const image = parts.find(part => part.inlineData?.data);
  if (!image) throw new Error("response carried no inline image data");

  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, `${slug}.png`);
  writeFileSync(out, Buffer.from(image.inlineData.data, "base64"));
  return out;
}

const [slug, subject] = process.argv.slice(2);
if (!slug || !subject) {
  console.error(
    'usage: node scripts/generate-cover.mjs <slug> "<subject: objects and arrangement>"'
  );
  process.exit(1);
}

generate(slug, subject)
  .then(out => {
    console.log(`wrote ${out}`);
    console.log("check it for stray text before shipping — docs/IMAGES.md §2.4");
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
