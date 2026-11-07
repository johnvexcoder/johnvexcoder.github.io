import fs from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function count(value, name) {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error(`${name} must be a nonnegative integer`);
  return value;
}
/** Local export summary. Missing data remains unavailable; this performs no network calls. */
export function summarizeSeoReport(input) {
  if (!input?.scope?.source || !input.scope.startDate || !input.scope.endDate)
    throw new Error("Record the source and explicit reporting window");
  for (const value of [input.scope.startDate, input.scope.endDate])
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      throw new Error("Use valid ISO reporting dates");
  if (input.scope.startDate > input.scope.endDate)
    throw new Error("Reporting dates are reversed");
  let search = null;
  if (input.searchRows?.length) {
    const seen = new Set();
    let clicks = 0,
      impressions = 0,
      positionWeight = 0;
    for (const row of input.searchRows) {
      const key = JSON.stringify([
        row.date ?? "",
        row.query ?? "",
        row.page ?? "",
        row.device ?? "",
        row.country ?? "",
      ]);
      if (seen.has(key))
        throw new Error(
          "Duplicate search-row grain; clarify aggregation before reporting",
        );
      seen.add(key);
      const c = count(row.clicks, "clicks"),
        i = count(row.impressions, "impressions");
      if (
        !Number.isFinite(row.position) ||
        row.position < 0 ||
        (i > 0 && row.position === 0)
      )
        throw new Error("Position needs a valid observed aggregate value");
      clicks += c;
      impressions += i;
      positionWeight += row.position * i;
    }
    search = {
      suppliedRows: input.searchRows.length,
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : null,
      impressionWeightedPosition: impressions
        ? positionWeight / impressions
        : null,
      scope: "Supplied rows only; not guaranteed property totals",
    };
  }
  let analytics = null;
  if (input.analytics) {
    const a = input.analytics;
    const sessions = count(a.organicSessions, "organic sessions"),
      inquiries = count(a.acceptedInquiryEvents, "accepted inquiry events");
    const comparable =
      a.attributionVerified === true &&
      a.startDate === input.scope.startDate &&
      a.endDate === input.scope.endDate &&
      a.sessionChannel === "Organic Search";
    analytics = {
      organicSessions: sessions,
      acceptedInquiryEvents: inquiries,
      acceptedInquiriesPerOrganicSession:
        comparable && sessions > 0 ? inquiries / sessions : null,
      attributionVerified: comparable,
      acceptanceMeaning:
        "Provider acceptance; not verified inbox delivery, qualified leads or revenue",
    };
  }
  return {
    scope: input.scope,
    search,
    analytics,
    missing: [
      !search && "Search data not available",
      !analytics && "Analytics/inquiry data not available",
    ].filter(Boolean),
    limitations: [
      "Search Console clicks are not analytics sessions",
      "Position is an impression-weighted aggregate for supplied rows",
      "Attribution and reporting scope are supplied, not independently authenticated",
    ],
  };
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  if (!process.argv[2])
    throw new Error("Provide an explicit local report-input JSON file");
  const file = await fs.open(process.argv[2], "r");
  try {
    if ((await file.stat()).size > 2 * 1024 * 1024)
      throw new Error("Report input exceeds 2 MiB");
    console.log(
      JSON.stringify(
        summarizeSeoReport(JSON.parse(await file.readFile("utf8"))),
        null,
        2,
      ),
    );
  } finally {
    await file.close();
  }
}
