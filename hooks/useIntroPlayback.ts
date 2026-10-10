"use client";
import { useLayoutEffect, useState } from "react";
import { INTRO_DURATION } from "@/lib/intro";
export function useIntroPlayback() {
  const [playback, setPlayback] = useState({ playing: false, started: 0 });
  const stop = () => {
    document.documentElement.dataset.introBoot = "complete";
    setPlayback((p) => ({ ...p, playing: false }));
  };
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const started = Number(root.dataset.introStarted || 0);
    if (
      root.dataset.introBoot !== "playing" ||
      reduced.matches ||
      performance.now() - started >= INTRO_DURATION
    ) {
      root.dataset.introBoot = "complete";
      return;
    }
    setPlayback({ playing: true, started });
    const timeout = setTimeout(
      stop,
      Math.max(0, INTRO_DURATION - (performance.now() - started)),
    );
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") stop();
    };
    const preference = () => {
      if (reduced.matches) stop();
    };
    const visibility = () => {
      if (document.hidden) stop();
    };
    const interact = (event: PointerEvent) => {
      if ((event.target as Element).closest("a, button, input")) stop();
    };
    document.addEventListener("pointerdown", interact, { passive: true });
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      document.removeEventListener("pointerdown", interact);
    };
  }, []);
  return { ...playback, skip: stop };
}
