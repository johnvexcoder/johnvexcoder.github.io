import type { Project } from "./content";
import { resolveSiteOrigin, resolveIndexing } from "./seo-policy";
export {
  homeSearchTitle,
  homeSearchDescription,
  projectSearchTitle,
} from "./seo-policy";
export const siteUrl = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const isIndexable = resolveIndexing(process.env.SITE_INDEXING);
export const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
export const projectSocialImage = (project: Project) =>
  project.image ? `/social/${project.id}.jpg` : "/social.png";
