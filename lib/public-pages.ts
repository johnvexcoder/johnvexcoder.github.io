import pages from "../content/site-pages.json" with { type: "json" };
export const publicPages = pages;
export const standalonePages = pages.filter((page) => page.route !== "/");
export function publicPage(id: string) {
  const page = pages.find((page) => page.id === id);
  if (!page) throw new Error(`Unknown public page: ${id}`);
  return page;
}
