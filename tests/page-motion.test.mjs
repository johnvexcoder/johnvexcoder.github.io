import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function motionHarness({ reduced = false, available = true } = {}) {
  const calls = [],
    listeners = {},
    preferenceListeners = {};
  let effect, observer;
  const element = (kind) => ({
    tagName: kind === "title" ? "H1" : "P",
    parentElement: { children: [] },
    contains: () => false,
    closest: () => null,
    setAttribute() {},
    matches: (selector) =>
      kind === "card" && selector.includes(".service-card"),
    animate(frames, options) {
      let finish;
      const animation = {
        frames,
        options,
        cancelled: false,
        cancel() {
          this.cancelled = true;
        },
        finished: new Promise((resolve) => {
          finish = resolve;
        }),
        finish() {
          finish();
        },
      };
      calls.push(animation);
      return animation;
    },
  });
  const label = element("label"),
    title = element("title"),
    card = element("card");
  card.parentElement.children = [card];
  const root = {
    animate: available ? () => {} : undefined,
    querySelector: () => ({ querySelectorAll: () => [label, title] }),
    querySelectorAll: () => [card],
    addEventListener: (name, fn) => (listeners[name] = fn),
    removeEventListener: (name) => delete listeners[name],
  };
  const preference = {
    matches: reduced,
    addEventListener: (name, fn) => (preferenceListeners[name] = fn),
    removeEventListener: (name) => delete preferenceListeners[name],
  };
  const code = ts.transpileModule(
    fs.readFileSync("components/PremiumPageMotion.tsx", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  const context = {
    exports: {},
    require: (name) =>
      name === "react"
        ? { useEffect: (fn) => (effect = fn) }
        : { usePathname: () => "/services/" },
    document: {
      querySelector: (selector) => (selector === ".site-footer" ? null : root),
      activeElement: null,
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    matchMedia: () => preference,
    IntersectionObserver: class {
      constructor(fn) {
        observer = { fn, disconnected: false };
        this.state = observer;
      }
      observe() {}
      unobserve() {}
      disconnect() {
        this.state.disconnected = true;
      }
    },
  };
  vm.runInNewContext(code, context);
  context.exports.default({ density: "editorial" });
  const cleanup = effect();
  return {
    calls,
    preference,
    preferenceListeners,
    listeners,
    cleanup,
    root,
    observer,
    card,
  };
}
test("premium motion is progressive: unavailable animation APIs leave content alone", () => {
  const h = motionHarness({ available: false });
  assert.equal(h.calls.length, 0);
  assert.equal(h.observer, undefined);
});
test("reduced motion skips entrances and scroll animations, while native FAQ remains untouched", () => {
  const h = motionHarness({ reduced: true });
  h.observer.fn([{ isIntersecting: true, target: h.card }]);
  assert.equal(h.calls.length, 0);
  h.cleanup();
  assert.equal(h.observer.disconnected, true);
});
test("hero stagger and card choreography are bounded, one-shot and cancelled on unmount", () => {
  const h = motionHarness();
  assert.equal(h.calls.length, 2);
  assert.equal(h.calls[0].options.delay, 0);
  assert.equal(h.calls[1].options.delay, 45);
  h.observer.fn([
    { isIntersecting: true, target: h.card },
    { isIntersecting: true, target: h.card },
  ]);
  assert.equal(h.calls.length, 3);
  assert.equal(h.calls.at(-1).options.duration, 420);
  h.cleanup();
  assert.ok(h.calls.every((a) => a.cancelled));
  assert.equal(h.observer.disconnected, true);
  assert.deepEqual(Object.keys(h.listeners), []);
});
test("changing to reduced motion cancels ongoing effects immediately", () => {
  const h = motionHarness();
  h.preference.matches = true;
  h.preferenceListeners.change();
  assert.ok(h.calls.every((a) => a.cancelled));
  h.cleanup();
});

test("server-rendered reveal wrappers keep content visible before enhancement", () => {
  const reveal = fs.readFileSync("components/Reveal.tsx", "utf8");
  assert.ok(!reveal.includes("IntersectionObserver"));
  const css = fs.readFileSync("app/globals.css", "utf8");
  assert.ok(!/\[data-reveal[^\]]*\][^{]*\{[^}]*opacity:\s*0/.test(css));
});
test("route entrances avoid native view transitions that abort on viewport changes", () => {
  const template = fs.readFileSync("app/template.tsx", "utf8");
  const css = fs.readFileSync("app/globals.css", "utf8");
  assert.ok(template.includes('className="route-scene"'));
  assert.ok(template.includes("key={pathname}"));
  assert.ok(!/(?:import\s*\{\s*ViewTransition|<ViewTransition\b|document\.startViewTransition\(|router\.push|preventDefault)/.test(template));
  assert.match(css, /\.route-scene\s*\{\s*animation:\s*portfolio-route-in/);
  assert.ok(!css.includes("::view-transition-old"));
  assert.ok(!css.includes("::view-transition-new"));
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.route-scene\s*\{\s*animation: none/);
});
