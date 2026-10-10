import test from "node:test";
import assert from "node:assert/strict";
import {
  panPosition,
  panPhase,
  loopCopies,
  loopDuration,
  assemblyState,
  loopOffset,
} from "../lib/motion.ts";
test("measured screenshot cycles remain continuous, bounded, and return through the whole image", () => {
  for (const max of [21, 80, 500, 3800]) {
    const travel = Math.max(12000, (max / 42) * 1000),
      cycle = travel * 2 + 3200;
    assert.equal(panPosition(max, 0), 0);
    assert.equal(panPosition(max, 1600 + travel), max);
    assert.equal(panPosition(max, cycle), 0);
    for (const boundary of [1600, 1600 + travel, 3200 + travel, cycle])
      assert.ok(
        Math.abs(
          panPosition(max, boundary - 0.01) - panPosition(max, boundary + 0.01),
        ) < 0.02,
      );
    for (let t = 0; t <= cycle * 2; t += 73) {
      const v = panPosition(max, t);
      assert.ok(v >= 0 && v <= max);
    }
  }
});
test("manual screenshot interaction resumes at the measured user position", () => {
  for (const max of [50, 500, 4000])
    for (const fraction of [0, 0.2, 0.75, 1])
      assert.ok(
        Math.abs(
          panPosition(max, panPhase(max, max * fraction)) - max * fraction,
        ) < 0.0001,
      );
});
test("screenshots without meaningful overflow stay still", () => {
  for (const max of [0, 1, 20]) assert.equal(panPosition(max, 90000), 0);
});
test("testimonial clones cover a complete translation for one, two and variable-width collections", () => {
  for (const widths of [[260], [335, 300], [300, 365, 330, 370, 290]])
    for (const viewport of [360, 768, 1440, 1920]) {
      const gap = 18,
        groupWidth = widths.reduce((a, b) => a + b, 0) + gap * widths.length;
      const copies = loopCopies(groupWidth, viewport);
      assert.ok(copies * groupWidth >= viewport);
      assert.equal(loopDuration(groupWidth) / 1000, groupWidth / 28);
      assert.ok((copies + 1) * groupWidth - groupWidth >= viewport);
    }
});
test("scroll assembly settles at both boundaries and has a restrained contact rebound", () => {
  assert.deepEqual(assemblyState(-1), { progress: 0, offset: 1, impact: 0 });
  const settled = assemblyState(2);
  assert.equal(settled.progress, 1);
  assert.equal(settled.offset, 0);
  assert.equal(settled.impact, 0);
  let rebounds = false;
  for (let p = 0; p <= 1; p += 0.001) {
    const state = assemblyState(p);
    assert.ok(state.offset >= -0.12 && state.offset <= 1);
    assert.ok(state.impact >= 0 && state.impact <= 0.6);
    rebounds ||= state.offset < 0;
    const next = assemblyState(p + 0.00001);
    assert.ok(Math.abs(next.offset - state.offset) < 0.0001);
  }
  assert.ok(rebounds, "the convergence includes a small actual overshoot");
});
test("scroll choreography is reversible with no accumulated state or direction-dependent jumps", () => {
  const forward = Array.from({ length: 101 }, (_, i) => assemblyState(i / 100));
  for (let i = 100; i >= 0; i--)
    assert.deepEqual(assemblyState(i / 100), forward[i]);
  for (const boundary of [0, 0.55, 1]) {
    const before = assemblyState(boundary - 0.00001);
    const after = assemblyState(boundary + 0.00001);
    assert.ok(Math.abs(before.offset - after.offset) < 0.0001);
    assert.ok(Math.abs(before.impact - after.impact) < 0.0001);
  }
});
test("feedback drag and horizontal scroll wrap in either direction through identical loop seams", () => {
  for (const width of [278, 665, 1915]) {
    assert.equal(loopOffset(0, width), 0);
    assert.equal(loopOffset(width, width), 0);
    assert.equal(loopOffset(-10, width), width - 10);
    assert.equal(loopOffset(width + 10, width), 10);
    for (const value of [-width * 5 - 23, -1, 0, 81, width * 4 + 10]) {
      const normalized = loopOffset(value, width);
      assert.ok(normalized >= 0 && normalized < width);
      assert.equal(loopOffset(value + width, width), normalized);
    }
  }
  assert.equal(loopOffset(100, 0), 0);
});
