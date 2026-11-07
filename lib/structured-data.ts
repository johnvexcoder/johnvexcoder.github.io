type CatalogItem = { name: string; route: string };
/** Pure graph additions; existing page renderers and stable identities remain in place. */
export function serviceCatalog(
  items: readonly CatalogItem[],
  origin: string,
  name: string,
) {
  return {
    "@type": "ItemList",
    "@id": new URL("/services/#catalog", origin).href,
    name,
    url: new URL("/services/", origin).href,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: new URL(item.route, origin).href,
      item: { "@id": new URL(`${item.route}#service`, origin).href },
    })),
  };
}
export function projectBreadcrumbs(
  name: string,
  route: string,
  origin: string,
) {
  return [
    {
      "@type": "ListItem",
      position: 1,
      name: "Portfolio",
      item: new URL("/", origin).href,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Work",
      item: new URL("/work/", origin).href,
    },
    {
      "@type": "ListItem",
      position: 3,
      name,
      item: new URL(route, origin).href,
    },
  ];
}
export function serializeJsonLd(value: unknown): string {
  const result = JSON.stringify(value);
  if (typeof result !== "string")
    throw new TypeError("JSON-LD requires a serializable value");
  return result.replaceAll("<", "\\u003c");
}
