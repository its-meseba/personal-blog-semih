/**
 * One `<script type="application/ld+json">`, rendered from a plain object.
 *
 * Every JSON-LD block on the site goes through here so the serialisation rule
 * lives in one place: `<` is escaped, because a literal `</script>` inside the
 * JSON would close the tag early and spill the rest of the graph into the page
 * as markup. React does not escape inside `dangerouslySetInnerHTML`.
 *
 * Safe in a client component: it renders during SSR, so crawlers that do not
 * execute JavaScript still see the markup in the HTML.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
