import { ImageResponse } from "next/og";
import { BRAND_NAME, MOTTO, SITE_NAME } from "../../author";
import { LIGHT } from "../../styles/tokens";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "72px", background: LIGHT.background, color: LIGHT.accent, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 5 }}>{BRAND_NAME}</div>
      <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.12, maxWidth: 1000 }}>{MOTTO}</div>
      <div style={{ display: "flex", borderTop: `2px solid ${LIGHT.borderStrong}`, paddingTop: 24, color: LIGHT.text, fontSize: 26 }}>{SITE_NAME}</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
