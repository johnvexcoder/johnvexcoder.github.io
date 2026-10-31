"use client";
/* eslint-disable @next/next/no-img-element -- Static SVG fallback supports no-script and reduced-motion presentations. */
import { useEffect, useRef, type CSSProperties } from "react";
import geography from "@/content/world-coastlines.json";

type Vector = [number, number, number];
const vector = ([longitude, latitude]: number[]): Vector => {
  const a = (longitude * Math.PI) / 180,
    b = (latitude * Math.PI) / 180;
  return [Math.cos(b) * Math.sin(a), -Math.sin(b), Math.cos(b) * Math.cos(a)];
};
const coastlines = geography.coastlines.map((ring) => {
  let longitude = 0,
    latitude = 0;
  const points: Vector[] = [];
  for (let i = 0; i < ring.length; i += 2) {
    longitude += ring[i];
    latitude += ring[i + 1];
    points.push(
      vector([
        longitude / geography.quantization,
        latitude / geography.quantization,
      ]),
    );
  }
  return points;
});
const landPoints = geography.landPoints.map(vector);
const graticule: Vector[][] = [];
for (let latitude = -60; latitude <= 60; latitude += 30)
  graticule.push(
    Array.from({ length: 91 }, (_, i) => vector([i * 4 - 180, latitude])),
  );
for (let longitude = -180; longitude < 180; longitude += 30)
  graticule.push(
    Array.from({ length: 46 }, (_, i) => vector([longitude, i * 4 - 90])),
  );
const connections = [
  [121, 14, -74, 41],
  [121, 14, 139, 36],
  [121, 14, 104, 1],
  [104, 1, 151, -34],
  [-0.1, 51, 121, 14],
  [-74, 41, -0.1, 51],
].map(([a, b, c, d]) => {
  const start = vector([a, b]),
    end = vector([c, d]);
  const angle = Math.acos(
    Math.min(
      1,
      Math.max(
        -1,
        start.reduce((sum, value, i) => sum + value * end[i], 0),
      ),
    ),
  );
  return Array.from({ length: 41 }, (_, i): Vector => {
    const t = i / 40,
      s = Math.sin(angle),
      lift = 1 + Math.sin(t * Math.PI) * 0.12;
    return start.map(
      (value, j) =>
        ((value * Math.sin((1 - t) * angle) + end[j] * Math.sin(t * angle)) /
          s) *
        lift,
    ) as Vector;
  });
});
const technologies = [
  "react",
  "typescript",
  "python",
  "docker",
  "linux",
  "nextjs",
  "github",
  "postgresql",
  "nodejs",
  "nginx",
];

/** Orthographic Earth, self-hosted geography and a bounded canvas loop, active only in view. */
export default function PortraitNetwork() {
  const root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = root.current,
      surface = canvas.current,
      ctx = surface?.getContext("2d", { alpha: true });
    if (!el || !surface || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const frameInterval =
      1000 / (matchMedia("(pointer: coarse)").matches ? 24 : 30);
    let width = 0,
      height = 0,
      radius = 0,
      frame = 0,
      last = 0,
      elapsed = 0,
      visible = false;
    let blue = "",
      cyan = "",
      soft = "";
    let cosine = 1,
      sine = 0;
    const tiltCos = Math.cos(-0.14),
      tiltSin = Math.sin(-0.14),
      projection: Vector = [0, 0, 0];
    const project = (point: Vector): Vector => {
      const x = point[0] * cosine + point[2] * sine,
        z = -point[0] * sine + point[2] * cosine;
      const y = point[1] * tiltCos - z * tiltSin,
        depth = point[1] * tiltSin + z * tiltCos;
      projection[0] = width / 2 + x * radius;
      projection[1] = height * 0.46 + y * radius;
      projection[2] = depth;
      return projection;
    };
    const line = (points: Vector[]) => {
      let pen = false;
      for (const point of points) {
        const [x, y, z] = project(point);
        if (z > 0) {
          if (pen) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          pen = true;
        } else pen = false;
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const angle = (-25 * Math.PI) / 180 + (elapsed / 80000) * Math.PI * 2;
      cosine = Math.cos(angle);
      sine = Math.sin(angle);
      // Sparse surrounding particles; no layout reads or React state in the frame loop.
      ctx.fillStyle = soft;
      for (let i = 0; i < 58; i++) {
        const x =
          (((i * 73.137) % 100) / 100) * width +
          Math.sin(elapsed / 14000 + i) * 5;
        const y =
          (((i * 37.791) % 100) / 100) * height +
          Math.cos(elapsed / 17000 + i) * 5;
        ctx.globalAlpha = 0.18 + (Math.sin(elapsed / 5000 + i) + 1) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, i % 7 === 0 ? 1.8 : 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = blue;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.46, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      for (const ring of graticule) line(ring);
      ctx.stroke();
      ctx.globalAlpha = 0.66;
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      for (const ring of coastlines) line(ring);
      ctx.stroke();
      ctx.globalAlpha = 0.48;
      ctx.fillStyle = blue;
      ctx.beginPath();
      for (const point of landPoints) {
        const [x, y, z] = project(point);
        if (z > 0.02) {
          ctx.moveTo(x + 1.2, y);
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (const arc of connections) line(arc);
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = cyan;
      ctx.beginPath();
      connections.forEach((arc, i) => {
        const point = arc[Math.floor(((elapsed / 8000 + i * 0.17) % 1) * 40)];
        const [x, y, z] = project(point);
        if (z > 0) {
          ctx.moveTo(x + 2.3, y);
          ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        }
      });
      ctx.fill();
      // Elliptical routes frame the world without crossing the foreground portrait.
      for (let i = 0; i < 2; i++) {
        const rotation = i === 0 ? -0.32 : 0.5,
          rx = radius * 1.16,
          ry = radius * (i === 0 ? 0.34 : 0.5),
          phase = elapsed / (i === 0 ? 18000 : -23000) + i;
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = blue;
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.46, rx, ry, rotation, 0, Math.PI * 2);
        ctx.stroke();
        const x = Math.cos(phase) * rx,
          y = Math.sin(phase) * ry;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = cyan;
        ctx.beginPath();
        ctx.arc(
          width / 2 + x * Math.cos(rotation) - y * Math.sin(rotation),
          height * 0.46 + x * Math.sin(rotation) + y * Math.cos(rotation),
          2.8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      el.dataset.canvasReady = "true";
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) {
        // The frame guard also covers a preference change delivered before its
        // MediaQueryList event; keep CSS orbits and the canvas in the same state.
        el.dataset.running = "false";
        last = 0;
        return;
      }
      if (!last) last = now;
      const delta = now - last;
      if (delta >= frameInterval) {
        elapsed += Math.min(delta, 100);
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      const active = visible && !document.hidden && !reduced.matches;
      el.dataset.running = String(active);
      if (!active) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        if (reduced.matches) draw();
      } else if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const box = el.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio || 1, 1.5);
      width = box.width;
      height = box.height;
      radius = Math.min(width * 0.47, height * 0.49);
      el.style.setProperty(
        "--portrait-orbit-radius",
        `${Math.min(radius * 1.1, (width / 2 - 24) / 1.1, (height * 0.46 - 24) / 0.88)}px`,
      );
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(el);
      blue = style.getPropertyValue("--blue").trim();
      cyan = style.getPropertyValue("--cyan").trim();
      soft = style.getPropertyValue("--soft").trim();
      draw();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(el);
    const viewport = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        update();
      },
      { threshold: 0.1 },
    );
    viewport.observe(el);
    const theme = new MutationObserver(resize);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      viewport.disconnect();
      theme.disconnect();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      el.dataset.running = "false";
    };
  }, []);
  return (
    <div
      className="portrait-network"
      ref={root}
      aria-hidden="true"
      data-running="false"
    >
      <img
        className="portrait-earth-still"
        src="/illustrations/network-earth.svg"
        width={480}
        height={480}
        alt=""
      />
      <canvas className="portrait-earth-canvas" ref={canvas} />
      <div className="portrait-floating-technologies">
        {technologies.map((logo, i) => (
          <span
            key={logo}
            className="portrait-tech-track"
            style={
              {
                "--orbit-start": `${i * 137.5}deg`,
                "--orbit-end": `${i * 137.5 + 360}deg`,
                "--orbit-counter-start": `${-i * 137.5}deg`,
                "--orbit-counter-end": `${-i * 137.5 - 360}deg`,
                "--orbit-tilt": `${[-24, 18, 6][i % 3]}deg`,
                "--orbit-scale": `${0.88 + (i % 4) * 0.07}`,
                "--float-duration": `${36 + (i % 5) * 7}s`,
                "--float-delay": `${-i * 5}s`,
              } as CSSProperties
            }
          >
            <span className="portrait-floating-tech">
              <span style={{ maskImage: `url(/icons/skills/${logo}.svg)` }} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
