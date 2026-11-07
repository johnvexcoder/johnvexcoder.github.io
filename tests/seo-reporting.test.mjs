import test from "node:test";
import assert from "node:assert/strict";
import { summarizeSeoReport } from "../scripts/seo-report.mjs";
const scope = {
  source: "Explicit synthetic fixture, not account performance",
  startDate: "2026-10-01",
  endDate: "2026-10-28",
};
test("missing search or inquiry data stays unavailable rather than becoming zero performance", () => {
  const r = summarizeSeoReport({ scope });
  assert.equal(r.search, null);
  assert.equal(r.analytics, null);
  assert.equal(r.missing.length, 2);
});
test("search rates use counts and position uses impressions, with an explicit supplied-row scope", () => {
  const r = summarizeSeoReport({
    scope,
    searchRows: [
      {
        query: "fixture a",
        page: "/a/",
        clicks: 5,
        impressions: 100,
        position: 2,
      },
      {
        query: "fixture b",
        page: "/b/",
        clicks: 5,
        impressions: 300,
        position: 10,
      },
    ],
  });
  assert.equal(r.search.ctr, 0.025);
  assert.equal(r.search.impressionWeightedPosition, 8);
  assert.match(r.search.scope, /Supplied rows/);
});
test("inquiry rate requires matching organic attribution/window and a nonzero denominator", () => {
  const analytics = {
    organicSessions: 100,
    acceptedInquiryEvents: 3,
    attributionVerified: true,
    sessionChannel: "Organic Search",
    startDate: scope.startDate,
    endDate: scope.endDate,
  };
  assert.equal(
    summarizeSeoReport({ scope, analytics }).analytics
      .acceptedInquiriesPerOrganicSession,
    0.03,
  );
  for (const patch of [
    { attributionVerified: false },
    { startDate: "2026-09-01" },
    { organicSessions: 0 },
    { sessionChannel: "Direct" },
  ])
    assert.equal(
      summarizeSeoReport({ scope, analytics: { ...analytics, ...patch } })
        .analytics.acceptedInquiriesPerOrganicSession,
      null,
    );
});
test("ambiguous duplicate row grains and invalid counts are rejected", () => {
  const row = {
    query: "fixture",
    page: "/",
    clicks: 1,
    impressions: 10,
    position: 2,
  };
  assert.throws(
    () => summarizeSeoReport({ scope, searchRows: [row, row] }),
    /Duplicate/,
  );
  assert.throws(
    () => summarizeSeoReport({ scope, searchRows: [{ ...row, clicks: -1 }] }),
    /nonnegative/,
  );
});

test("invalid calendar dates and reversed reporting windows are rejected", () => {
  assert.throws(
    () => summarizeSeoReport({ scope: { ...scope, startDate: "2026-02-30" } }),
    /valid ISO/,
  );
  assert.throws(
    () => summarizeSeoReport({ scope: { ...scope, startDate: "2026-11-01" } }),
    /reversed/,
  );
});
