import { getSeries, getSeriesBySlug } from "@/lib/content";
import { ATOM_CONTENT_TYPE, buildAtomFeed } from "@/lib/feed";
import { author } from "@/app/author";

export const revalidate = 60;

export async function generateStaticParams() {
  return getSeries().map(series => ({ slug: series.id }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(
    buildAtomFeed(series.posts, {
      selfPath: `/series/${series.id}/atom`,
      alternatePath: `/series/${series.id}`,
      title: `${author.name} — ${series.name}`,
      subtitle: series.description ?? `Posts in the ${series.name} series`,
    }),
    {
      headers: {
        "Content-Type": ATOM_CONTENT_TYPE,
      },
    }
  );
}
