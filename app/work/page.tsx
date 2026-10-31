import EditorialPage, { editorialMetadata } from "@/components/EditorialPage";
import { publicPage } from "@/lib/public-pages";
import Projects from "@/components/Projects";
export const metadata = editorialMetadata("work");
export default function WorksPage() {
  return (
    <EditorialPage id="work">
      <Projects directory />
      <p className="work-scope-note">{publicPage("work").paragraphs[1]}</p>
    </EditorialPage>
  );
}
