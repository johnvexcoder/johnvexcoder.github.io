import content from "@/content/case-studies.json";
export const caseStudies = content;
export const caseStudy = (id: string) =>
  caseStudies.find((study) => study.id === id)!;
