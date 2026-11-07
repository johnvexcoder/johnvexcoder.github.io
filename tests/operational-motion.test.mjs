import test from "node:test";
import assert from "node:assert/strict";
import { timelineStops } from "../lib/operational-motion.ts";
test("timeline pulse timing follows rendered marker positions after wrapping and resizing", () => {
  assert.deepEqual(
    timelineStops([30, 130, 430]).map((x) => x.delay),
    [0, 900, 3600],
  );
  assert.deepEqual(
    timelineStops([30, 230, 430]).map((x) => x.delay),
    [0, 1800, 3600],
  );
  assert.deepEqual(timelineStops([]), []);
  assert.equal(timelineStops([25])[0].delay, 0);
});
