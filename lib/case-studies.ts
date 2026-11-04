import content from "@/content/case-studies.json";
type CaseGalleryView = {
  image: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  sources: { src: string; width: number }[];
};
type CaseStudy = Omit<(typeof content)[number], "gallery"> & {
  subtitle?: string;
  gallery?: CaseGalleryView[];
};
export const caseStudies = content as CaseStudy[];
export const caseStudy = (id: string) =>
  caseStudies.find((study) => study.id === id)!;
