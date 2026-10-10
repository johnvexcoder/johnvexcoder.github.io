"use client";
import { useEffect, type RefObject } from "react";
import { loopCopies, loopDuration, loopOffset } from "@/lib/motion";

/** A single measured loop, scrubbed directly by drag, horizontal wheel or keys. */
export function useFeedbackMotion(
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
  groupRef: RefObject<HTMLDivElement | null>,
  reduced: boolean,
  setRepeat: (copies: number) => void,
) {
  useEffect(() => {
    const viewport = viewportRef.current,
      track = trackRef.current,
      group = groupRef.current;
    if (!viewport || !track || !group) return;
    let animation: Animation | null = null,
      width = 0,
      duration = 1,
      inView = false;
    let pointerId: number | null = null,
      originX = 0,
      originY = 0,
      originOffset = 0,
      dragging = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const holds = new Set<string>();
    const sync = () => {
      viewport.dataset.interacting = holds.size ? "true" : "false";
      if (holds.size || !inView || document.hidden) animation?.pause();
      else animation?.play();
    };
    const hold = (reason: string) => {
      holds.add(reason);
      sync();
    };
    const release = (reason: string) => {
      holds.delete(reason);
      sync();
    };
    const currentOffset = () =>
      loopOffset(
        (Number(animation?.currentTime || 0) / duration) * width,
        width,
      );
    const seek = (offset: number) => {
      if (animation && width)
        animation.currentTime = (loopOffset(offset, width) / width) * duration;
    };
    const grace = () => {
      hold("grace");
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => release("grace"), 1800);
    };
    const measure = () => {
      const fraction = width ? currentOffset() / width : 0;
      animation?.cancel();
      animation = null;
      width = group.getBoundingClientRect().width;
      if (!width) return;
      setRepeat(loopCopies(width, viewport.clientWidth));
      if (reduced) return;
      duration = loopDuration(width);
      animation = track.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(-${width}px)` },
        ],
        { duration, iterations: Infinity, easing: "linear" },
      );
      animation.currentTime = fraction * duration;
      sync();
    };
    const down = (event: PointerEvent) => {
      if (reduced || event.button !== 0 || pointerId !== null) return;
      pointerId = event.pointerId;
      originX = event.clientX;
      originY = event.clientY;
      originOffset = currentOffset();
      dragging = false;
      hold("pointer");
      viewport.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - originX,
        dy = event.clientY - originY;
      if (!dragging && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        dragging = true;
        viewport.dataset.dragging = "true";
      }
      if (dragging) {
        event.preventDefault();
        seek(originOffset - dx);
      }
    };
    const end = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      if (viewport.hasPointerCapture(event.pointerId))
        viewport.releasePointerCapture(event.pointerId);
      pointerId = null;
      viewport.dataset.dragging = "false";
      grace();
      release("pointer");
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hold("hover");
    };
    const leave = () => release("hover");
    const focus = () => {
      if (viewport.matches(":focus-visible")) hold("focus");
    };
    const blur = () => release("focus");
    const wheel = (event: WheelEvent) => {
      const delta =
        event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      if (
        reduced ||
        !delta ||
        (!event.shiftKey && Math.abs(event.deltaY) >= Math.abs(delta))
      )
        return;
      event.preventDefault();
      grace();
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? viewport.clientWidth
            : 1;
      seek(currentOffset() + delta * unit);
    };
    const key = (event: KeyboardEvent) => {
      if (reduced || !["ArrowLeft", "ArrowRight", "Home"].includes(event.key))
        return;
      event.preventDefault();
      hold("focus");
      grace();
      seek(
        event.key === "Home"
          ? 0
          : currentOffset() +
              (event.key === "ArrowRight" ? 1 : -1) *
                Math.min(380, viewport.clientWidth * 0.8),
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(viewport);
    const resize = new ResizeObserver(measure);
    resize.observe(group);
    resize.observe(viewport);
    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerup", end);
    viewport.addEventListener("pointercancel", end);
    viewport.addEventListener("lostpointercapture", end);
    viewport.addEventListener("pointerenter", enter);
    viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("focus", focus);
    viewport.addEventListener("blur", blur);
    viewport.addEventListener("wheel", wheel, { passive: false });
    viewport.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", sync);
    measure();
    return () => {
      clearTimeout(resumeTimer);
      animation?.cancel();
      observer.disconnect();
      resize.disconnect();
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerup", end);
      viewport.removeEventListener("pointercancel", end);
      viewport.removeEventListener("lostpointercapture", end);
      viewport.removeEventListener("pointerenter", enter);
      viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("focus", focus);
      viewport.removeEventListener("blur", blur);
      viewport.removeEventListener("wheel", wheel);
      viewport.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", sync);
      delete viewport.dataset.interacting;
      delete viewport.dataset.dragging;
    };
  }, [reduced, setRepeat, viewportRef, trackRef, groupRef]);
}
