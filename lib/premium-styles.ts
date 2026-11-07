import { readFileSync } from "node:fs";
import { join } from "node:path";
// Build-time CSS for the two scoped static pages; no extra blocking stylesheet request.
export const premiumStyles = readFileSync(join(process.cwd(), "app/premium-upgrade.css"), "utf8");
