/* eslint-disable */
/* tslint:disable */
const withMDX = require("@next/mdx")({
  remarkPlugins: [require("remark-gfm")],
  rehypePlugins: [],
});

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  // `lib/content.ts` reads the post sources at request time on dynamic routes,
  // so the MDX files must be traced into the serverless output. Every year
  // folder, not just this year's — a hardcoded year drops next year's posts.
  outputFileTracingIncludes: {
    "/**": ["./app/(post)/*/**/*.mdx"],
  },
  typescript: {
    // Type errors fail the build. `npx tsc --noEmit` is clean, so nothing is
    // being hidden here and nothing should be.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Stays ON deliberately: eslint 8.56 cannot read the eslint-config-next 16
    // flat config and dies with "Converting circular structure to JSON", so
    // enabling lint here breaks the build outright. The real fix is upgrading
    // eslint (v9) and migrating the config — not flipping this flag.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  headers() {
    return [
      {
        source: "/images/photo.jpeg",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  redirects() {
    return [
      {
        source: "/essays/:nested*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/slackin/:nested*",
        destination: "https://github.com/rauchg/slackin",
        permanent: true,
      },
    ];
  },
});
