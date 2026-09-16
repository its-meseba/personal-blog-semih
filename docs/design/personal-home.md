# meseba editorial homepage

PR direction, September 2026. Identity remains canonical in [personal-brand.md](../personal-brand.md).

## Purpose and composition

Adapt Web Printer's `attention` direction for a personal product-builder website. Help readers understand Semih's combination of product judgment and engineering, then explore his experience, writing, or LinkedIn. No project catalogue, fabricated product UI, or decorative stock artwork.

- Portrait-led hero with the approved motto as the single H1, name and role above, one work anchor.
- Understand / Build / Improve selector: real examples of Semih's work, accessible pressed buttons and live detail region. This explains his working approach; it is not a simulated app.
- Burgundy Stealth Company feature with role, concise responsibilities, and dated product scale. MAU and revenue describe company scale, not growth personally caused by Semih.
- Existing live writing feed, followed by three recent roles and native expandable education and recognition.
- Closing LinkedIn CTA and writing link. No unverified email or availability claim.

## Layout and accessibility

Homepage only: 1200px shell; article reading widths stay unchanged. Existing Archivo, Source Serif, JetBrains Mono and theme tokens. Responsive headline 50–101px; section spacing 64–112px. Hero and Stealth Company split into columns above 700px, stack below. Portrait arch becomes a square crop on small screens. Work buttons form a row on mobile. No fixed overlay navigation. Natural section heights; browser zoom enabled. Focus indicators and reduced-motion-aware existing post skeletons.

## Imagery

Use the existing real portrait `/public/images/photo.jpeg` (640 x 640), served through Next Image responsive optimization with reserved dimensions and priority. No generated likeness or decorative imagery: authenticity is the explanatory visual for this personal site. The approved logo, favicon and share card remain unchanged.

## Copy and reuse

Voice: direct, warm, short, specific. Motto: “Products, mostly. Companies, sometimes.” Keep meseba and @its_meseba distinct. Stealth Company shows 140K+ MAU from August 2026 analytics and $4M revenue supplied by Semih on September 16. The revenue period was not specified: do not label it ARR, annual, or monthly revenue. Do not publish product-identifying usage metrics. Do not reuse unverified subscriber counts or revenue uplift claims. For social crops preserve the existing paper/burgundy palette, readable motto, and text-safe portrait placement. Public posts and ads require separate publishing authorization.

Experience copy follows the CV supplied September 16: Stealth Company, Upily, and Solace only. Solace title is CEO & Co-Founder. Each role has one short sentence; internships are omitted from this overview.

Public employer label is Stealth Company. Experience summaries are one short sentence per role; the employer feature uses one short line without responsibility bullets.

## Progressive portrait

The existing 640px photo loads first. After it loads, Next Image requests the responsive optimized version of `/public/images/portrait-high-quality.png`, a 2048px original supplied by Semih. The new layer fades in only after decoding, with matching crop and reserved geometry. The original stays underneath on network/decode failure; reduced motion disables the fade. The original PNG is preserved without alteration; browsers receive optimized responsive variants.
