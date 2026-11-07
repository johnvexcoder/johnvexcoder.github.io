"use client";
import { useEffect, useRef } from "react";
import { observeMotion } from "@/lib/visible-motion";
import {
  stageFrames,
  scanFrames,
  travelFrames,
  chartSeries,
} from "@/lib/workflow-motion";

/** The illustration itself is the unobtrusive toggle. No per-frame React updates. */
export default function ServiceWorkflowMotion({ name }: { name: string }) {
  const control = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const button = control.current,
      root = button?.closest<HTMLElement>("[data-service-illustration]");
    if (!button || !root || !root.animate || !globalThis.IntersectionObserver)
      return;
    const count = Number(root.dataset.stageCount);
    const duration = count * 2800;
    const animations: Animation[] = [];
    let visible = false,
      restricted = false,
      held = false;
    const add = (el: Element, frames: Keyframe[]) => {
      const a = el.animate(frames, {
        duration,
        iterations: Infinity,
        easing: "linear",
      });
      a.pause();
      a.currentTime = 0;
      animations.push(a);
    };
    const start = () => {
      root.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => {
        add(el, stageFrames(Number(el.dataset.stage), count, duration));
      });
      root.querySelectorAll<HTMLElement>("[data-travel]").forEach((el) => {
        add(el, travelFrames(count, Number(el.dataset.travel)));
      });
      root.querySelectorAll<SVGElement>("[data-chart-bar]").forEach((bar) => {
        const i = Number(bar.dataset.chartBar);
        const values = [...chartSeries, chartSeries[0]];
        add(
          bar,
          values.map((series, j) => ({
            offset: j / (values.length - 1),
            transform: "scaleY(" + series[i] / chartSeries[0][i] + ")",
            easing: "cubic-bezier(.45,0,.55,1)",
          })),
        );
      });
      root.querySelectorAll<HTMLElement>("[data-scan]").forEach((el) => {
        add(el, scanFrames(Number(el.dataset.scan), count));
      });
      root.dataset.enhanced = "";
    };
    const sync = () => {
      if (restricted) {
        animations.splice(0).forEach((a) => a.cancel());
        delete root.dataset.enhanced;
      } else if (visible && !animations.length) start();
      button.hidden = restricted;
      const run = visible && !restricted && !held;
      animations.forEach((a) => (run ? a.play() : a.pause()));
      root.dataset.motionRunning = String(run);
      root.dataset.motionHeld = String(held);
      button.setAttribute("aria-pressed", String(held));
      button.setAttribute(
        "aria-label",
        (held ? "Resume " : "Freeze ") + name + " workflow animation",
      );
    };
    const toggle = () => {
      held = !held;
      sync();
    };
    button.addEventListener("click", toggle);
    const stop = observeMotion(
      root,
      (show, limit) => {
        visible = show;
        restricted = limit;
        sync();
      },
      true,
    );
    return () => {
      stop();
      animations.forEach((a) => a.cancel());
      button.removeEventListener("click", toggle);
      delete root.dataset.enhanced;
    };
  }, [name]);
  return (
    <button
      ref={control}
      type="button"
      hidden
      className="workflow-surface-control"
      aria-label={"Freeze " + name + " workflow animation"}
      aria-pressed="false"
    >
      <span className="workflow-keyboard-hint">
        Enter or tap to freeze / resume
      </span>
    </button>
  );
}
