import resume from "../content/resume.json" with { type: "json" };
export const resumeFileName = resume.fileName;
export const resumeHref = `/${encodeURIComponent(resumeFileName)}`;
