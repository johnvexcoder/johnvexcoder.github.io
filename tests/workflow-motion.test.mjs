import test from "node:test";
import assert from "node:assert/strict";
import {
  stageFrames,
  scanFrames,
  travelFrames,
  workflows,
  chartSeries,
} from "../lib/workflow-motion.ts";
test("all nine workflows express the requested operational journeys", () => {
  assert.equal(Object.keys(workflows).length, 9);
  assert.deepEqual(workflows["booking-systems"], [
    "Select date",
    "Book now",
    "Payment",
    "Reservation",
  ]);
  assert.deepEqual(workflows["technical-seo"], [
    "Crawl",
    "Analyze",
    "Identify issue",
    "Apply fix",
    "Validate",
  ]);
  assert.deepEqual(workflows["cms-solutions"], [
    "Draft",
    "Review",
    "Approval",
    "Publish",
  ]);
});
test("crossfades cover each timeline stage without opacity flashes on loop boundaries", () => {
  for (const count of [4, 5])
    for (let i = 0; i < count; i++) {
      const f = stageFrames(i, count, count * 2800);
      assert.ok(
        f.every(
          (x, j) =>
            x.offset >= 0 &&
            x.offset <= 1 &&
            (!j || x.offset >= f[j - 1].offset),
        ),
      );
      assert.equal(f[0].opacity, i === 0 ? 1 : 0);
      assert.equal(f.at(-1).opacity, f[0].opacity);
      assert.ok(f.some((x) => x.opacity === 1));
    }
});
test("pipeline motion stays in declared lanes and hides before the return journey", () => {
  for (const n of [4, 5]) {
    const f = travelFrames(n, 6);
    assert.ok(f.every((x, j) => !j || x.offset >= f[j - 1].offset));
    assert.deepEqual({ ...f[0], offset: 1 }, f.at(-1));
    assert.equal(f.at(-3).opacity, 0);
    assert.equal(f.at(-2).opacity, 0);
  }
});
test("dashboard chart uses bounded coherent datasets and returns to its first snapshot", () => {
  assert.equal(chartSeries.length, 4);
  assert.ok(
    chartSeries.every((s) => s.length === 7 && s.every((v) => v > 0 && v <= 1)),
  );
  assert.notDeepEqual(chartSeries[0], chartSeries[1]);
});

test("scan progress accepts serialized markers and guards non-finite timeline offsets", () => {
  for (const count of [4, 5])
    for (const marker of [0, 2, count - 1, Number("true"), -1]) {
      const frames = scanFrames(marker, count);
      assert.ok(
        frames.every(
          (f, i) =>
            Number.isFinite(f.offset) &&
            f.offset >= 0 &&
            f.offset <= 1 &&
            (!i || f.offset >= frames[i - 1].offset),
        ),
      );
      assert.equal(frames[0].transform, frames.at(-1).transform);
    }
});
