import { llmsDirectory } from "@/lib/public-documents";
import { isIndexable } from "@/lib/seo";
export const dynamic = "force-static";
export function GET() {
  return new Response(
    isIndexable
      ? llmsDirectory()
      : "# J0hnvexcoder preview\n\nNot intended for indexing.\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
