import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  INTRO_DURATION,
  introPhase,
  introProgress,
  introBootstrap,
  NETWORK_START,
  NETWORK_END,
  NETWORK_OLD,
  NETWORK_RESILIENT,
  networkPoints,
} from "../lib/intro.ts";
test("intro phases are deterministic, bounded and match the wordless storyboard", () => {
  assert.equal(INTRO_DURATION, 3600);
  for (const [time, phase] of [
    [0, "system"],
    [650, "failure"],
    [1150, "restructure"],
    [2200, "stabilize"],
    [2850, "hero-morph"],
    [3600, "complete"],
  ])
    assert.equal(introPhase(time), phase);
  assert.equal(introProgress(-100), 0);
  assert.equal(introProgress(5000), 1);
  assert.deepEqual(networkPoints(0), NETWORK_START);
  assert.deepEqual(networkPoints(2200), NETWORK_END);
  for (let t = 1150; t < 2200; t += 5) {
    const points = networkPoints(t),
      next = networkPoints(t + 1);
    points.forEach(([x, y], i) => {
      assert.ok(x >= 0 && x <= 1120 && y >= 0 && y <= 550);
      assert.ok(Math.hypot(next[i][0] - x, next[i][1] - y) < 1);
    });
  }
});
const connected = (edges, from = 6, to = 7) => {
  const seen = new Set([from]),
    queue = [from];
  while (queue.length) {
    const current = queue.shift();
    for (const [a, b] of edges) {
      const next = a === current ? b : b === current ? a : null;
      if (next !== null && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.has(to);
};
test("restructuring removes the vulnerable connection and builds independently redundant routes", () => {
  assert.ok(NETWORK_OLD.some(([a, b]) => a === 6 && b === 7));
  assert.ok(
    !NETWORK_RESILIENT.some(
      ([a, b]) => (a === 6 && b === 7) || (a === 7 && b === 6),
    ),
  );
  assert.ok(NETWORK_RESILIENT.length > NETWORK_OLD.length);
  assert.ok(connected(NETWORK_RESILIENT));
  for (let i = 0; i < NETWORK_RESILIENT.length; i++)
    assert.ok(connected(NETWORK_RESILIENT.filter((_, n) => n !== i)));
  const mobile = NETWORK_RESILIENT.filter((edge) =>
    edge.every((n) => ![2, 5, 9, 11].includes(n)),
  );
  for (let i = 0; i < mobile.length; i++)
    assert.ok(connected(mobile.filter((_, n) => n !== i)));
});
function boot({ visited = false, reduced = false, storageFails = false } = {}) {
  const dataset = {},
    timers = [];
  let marked = false;
  const events = new Map();
  vm.runInNewContext(introBootstrap, {
    document: {
      documentElement: { dataset },
      addEventListener(name, fn) {
        events.set(name, fn);
      },
      removeEventListener(name) {
        events.delete(name);
      },
    },
    matchMedia: () => ({ matches: reduced }),
    sessionStorage: {
      getItem: () => {
        if (storageFails) throw Error("Unavailable");
        return visited ? "1" : null;
      },
      setItem: () => {
        marked = true;
      },
    },
    performance: { now: () => 100 },
    location: { search: "" },
    URLSearchParams,
    setTimeout: (fn, ms) => {
      timers.push({ fn, ms });
    },
  });
  return { dataset, timers, marked, events };
}
test("first session plays, refresh skips, reduced motion skips and storage failure leaves the hero usable", () => {
  const first = boot();
  assert.equal(first.dataset.introBoot, "playing");
  assert.ok(first.marked);
  assert.equal(first.timers[0].ms, 4200);
  first.timers[0].fn();
  assert.equal(first.dataset.introBoot, "complete");
  const early = boot();
  early.events.get("keydown")({ key: "Escape" });
  assert.equal(early.dataset.introBoot, "complete");
  assert.equal(early.events.size, 0);
  assert.equal(boot({ visited: true }).dataset.introBoot, undefined);
  assert.equal(boot({ reduced: true }).dataset.introBoot, undefined);
  assert.equal(boot({ storageFails: true }).dataset.introBoot, undefined);
});
