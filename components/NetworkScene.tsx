"use client";
import { useLayoutEffect, useRef } from "react";
import {
  INTRO_DURATION,
  networkGeometryCss,
  introPhase,
  networkPoints,
  NETWORK_END as after,
  NETWORK_OLD as original,
  NETWORK_RESILIENT as resilient,
  type NetworkPoint as Point,
} from "@/lib/intro";
const path = (points: Point[], [a, b]: number[]) =>
  `M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`;
export default function NetworkScene({
  playing,
  started,
}: {
  playing: boolean;
  started: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg || !playing) return;
    const circles = [...svg.querySelectorAll<SVGCircleElement>(".story-node")];
    const oldPaths = [
      ...svg.querySelectorAll<SVGPathElement>(".story-old path"),
    ];
    const newPaths = [
      ...svg.querySelectorAll<SVGPathElement>(".story-new path"),
    ];
    const weak = svg.querySelector<SVGPathElement>(".story-fault")!;
    const pulse = svg.querySelector<SVGPathElement>(".story-energy")!;
    const verify = svg.querySelector<SVGPathElement>(".story-verify")!;
    const verifyNodes = matchMedia("(max-width:600px)").matches
      ? [0, 1, 6, 10, 7, 8, 3, 4]
      : [0, 5, 6, 2, 3, 8, 11, 10, 6];
    const nativeGeometry = CSS.supports("d", 'path("M0 0L1 1")');
    let frame = 0,
      phase = "";
    const tick = (now: number) => {
      const elapsed = now - started;
      const points = networkPoints(elapsed);
      if (!nativeGeometry) {
        circles.forEach((circle, i) => {
          circle.setAttribute("cx", String(points[i][0]));
          circle.setAttribute("cy", String(points[i][1]));
        });
        oldPaths.forEach((edge, i) =>
          edge.setAttribute("d", path(points, original[i])),
        );
        newPaths.forEach((edge, i) =>
          edge.setAttribute("d", path(points, resilient[i])),
        );
        weak.setAttribute("d", path(points, [6, 7]));
        pulse.setAttribute(
          "d",
          [0, 1, 6, 10, 7, 8, 3, 4]
            .map((i, n) => `${n ? "L" : "M"}${points[i][0]} ${points[i][1]}`)
            .join(" "),
        );
        verify.setAttribute(
          "d",
          verifyNodes
            .map((i, n) => `${n ? "L" : "M"}${points[i][0]} ${points[i][1]}`)
            .join(" "),
        );
      }
      const next = introPhase(elapsed);
      if (next !== phase) {
        phase = next;
        svg.closest(".hero")?.setAttribute("data-intro-phase", phase);
      }
      if (elapsed < INTRO_DURATION && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      circles.forEach((circle, i) => {
        circle.setAttribute("cx", String(after[i][0]));
        circle.setAttribute("cy", String(after[i][1]));
      });
      oldPaths.forEach((edge, i) =>
        edge.setAttribute("d", path(after, original[i])),
      );
      newPaths.forEach((edge, i) =>
        edge.setAttribute("d", path(after, resilient[i])),
      );
      weak.setAttribute("d", path(after, [6, 7]));
      pulse.setAttribute(
        "d",
        [0, 1, 6, 10, 7, 8, 3, 4]
          .map((i, n) => `${n ? "L" : "M"}${after[i][0]} ${after[i][1]}`)
          .join(" "),
      );
      verify.setAttribute(
        "d",
        verifyNodes
          .map((i, n) => `${n ? "L" : "M"}${after[i][0]} ${after[i][1]}`)
          .join(" "),
      );
      svg.closest(".hero")?.setAttribute("data-intro-phase", "complete");
    };
  }, [playing, started]);
  return (
    <svg
      ref={ref}
      className="hero-network story-network"
      viewBox="0 0 1120 550"
      aria-hidden="true"
    >
      <style>{networkGeometryCss}</style>
      <g className="story-old">
        {original.map((edge, i) => (
          <path
            key={i}
            className={
              edge.some((n) => [2, 5, 9, 11].includes(n))
                ? "story-secondary"
                : ""
            }
            pathLength={1}
            d={path(after, edge)}
          />
        ))}
      </g>
      <g className="story-new">
        {resilient.map((edge, i) => (
          <path
            key={i}
            className={
              edge.some((n) => [2, 5, 9, 11].includes(n))
                ? "story-secondary"
                : ""
            }
            pathLength={1}
            d={path(after, edge)}
          />
        ))}
      </g>
      <path className="story-fault" d={path(after, [6, 7])} />
      <g className="story-nodes">
        {after.map(([x, y], i) => (
          <circle
            key={i}
            className={`story-node ${i === 7 ? "story-vulnerable" : ""} ${[2, 5, 9, 11].includes(i) ? "story-secondary" : ""}`}
            cx={x}
            cy={y}
            r={i === 7 ? 5 : 3.5}
          />
        ))}
      </g>
      <path
        className="story-energy"
        pathLength={1}
        d="M90 100L300 55L345 225L305 460L565 300L815 245L750 65L1020 135"
      />
      <path
        className="story-verify"
        pathLength={1}
        d="M90 100L160 300L345 225L490 110L750 65L815 245L790 455L305 460L345 225"
      />
    </svg>
  );
}
