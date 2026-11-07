"use client";
import { useEffect, useRef } from "react";
import { skills } from "@/lib/content";
import { observeMotion } from "@/lib/visible-motion";
import SkillIcon from "./SkillIcon";

export default function TechnologyMarquee({
  direction,
}: {
  direction: "left" | "right";
}) {
  const root = useRef<HTMLDivElement>(null);
  const trackName = direction === "right" ? "Top" : "Bottom";
  useEffect(() => {
    const el = root.current;
    const window = el?.querySelector<HTMLElement>(".marquee-window");
    const track = el?.querySelector<HTMLElement>(".marquee-track");
    const half = el?.querySelector<HTMLElement>(".marquee-live");
    if (
      !el ||
      !window ||
      !track ||
      !half ||
      !track.animate ||
      !globalThis.IntersectionObserver
    )
      return;
    const buttons = [
      ...half.querySelectorAll<HTMLButtonElement>(".skill-icon"),
    ];
    let animation: Animation | undefined;
    let distance = 0,
      duration = 0,
      index = 0,
      visible = false,
      restricted = false;
    let hold = false,
      hover: HTMLElement | null = null,
      tap: HTMLElement | null = null,
      focused: HTMLElement | null = null,
      keyboard = false;

    const reconcile = () => {
      if (restricted) {
        animation?.cancel();
        animation = undefined;
        delete el.dataset.moving;
      } else if (visible && !animation) {
        distance = half.getBoundingClientRect().width;
        if (distance) {
          el.dataset.moving = "true";
          window.scrollLeft = 0;
          duration = (distance / 24) * 1000;
          animation = track.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
            {
              duration,
              direction: direction === "right" ? "reverse" : "normal",
              iterations: Infinity,
            },
          );
        }
      }
      const run =
        visible && !restricted && !hover && !tap && !keyboard && !hold;
      if (animation) {
        if (run) animation.play();
        else animation.pause();
      }
      el.dataset.running = String(!!animation && run);
      window.setAttribute(
        "aria-label",
        (direction === "right" ? "Top" : "Bottom") +
          " technology track" +
          (hold ? ", held still" : ""),
      );
    };
    const inspect = (item: HTMLElement | null) => {
      const previous = el.querySelector<HTMLElement>("[data-inspected]");
      if (previous !== item) previous?.removeAttribute("data-inspected");
      if (!item) return;
      const tip = item.querySelector<HTMLElement>(".skill-tooltip");
      if (tip) {
        const viewport = window.getBoundingClientRect(),
          box = item.getBoundingClientRect();
        const width = tip.getBoundingClientRect().width / 2;
        const center = box.left + box.width / 2;
        const x = Math.max(
          viewport.left + width + 4,
          Math.min(viewport.right - width - 4, center),
        );
        item.style.setProperty("--skill-tooltip-offset", `${x - center}px`);
      }
      item.dataset.inspected = "";
    };
    const icon = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest<HTMLElement>(".skill-icon")
        : null;
    const seek = (button: HTMLElement) => {
      const viewport = window.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      if (box.left >= viewport.left + 4 && box.right <= viewport.right - 4)
        return;
      if (!animation) {
        window.scrollLeft +=
          box.left + box.width / 2 - viewport.left - viewport.width / 2;
        return;
      }
      const offset = box.left - track.getBoundingClientRect().left;
      const shift = Math.max(
        0,
        Math.min(distance - 1, offset - viewport.width / 2 + box.width / 2),
      );
      const fraction = shift / distance;
      animation.currentTime = Math.min(
        duration - 0.1,
        (direction === "right" ? 1 - fraction : fraction) * duration,
      );
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const next = icon(event.target);
      if (hover === next) return;
      hover = next;
      inspect(hover || tap || focused);
      reconcile();
    };
    const out = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        !hover ||
        hover.contains(event.relatedTarget as Node | null)
      )
        return;
      hover = null;
      inspect(tap || focused);
      reconcile();
    };
    const click = (event: MouseEvent) => {
      const item = icon(event.target);
      if (
        !item ||
        !(
          matchMedia("(any-pointer: coarse)").matches ||
          (event instanceof PointerEvent && event.pointerType === "touch")
        )
      )
        return;
      tap = tap === item ? null : item;
      inspect(tap || focused);
      reconcile();
    };
    const clearTap = () => {
      if (!tap) return;
      tap = null;
      inspect(hover || focused);
      reconcile();
    };
    const focusIn = (event: FocusEvent) => {
      if (
        !(event.target instanceof HTMLElement) ||
        !event.target.matches(":focus-visible")
      )
        return;
      keyboard = true;
      const item = icon(event.target);
      focused = item;
      if (item) {
        const next = buttons.indexOf(item as HTMLButtonElement);
        if (next !== -1) {
          buttons[index].tabIndex = -1;
          index = next;
          buttons[index].tabIndex = 0;
        }
        reconcile();
        seek(item);
        inspect(item);
      } else reconcile();
    };
    const focusOut = (event: FocusEvent) => {
      if (window.contains(event.relatedTarget as Node | null)) {
        focused = null;
      } else {
        keyboard = false;
        focused = null;
      }
      inspect(hover || tap);
      reconcile();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        inspect(null);
        return;
      }
      if (event.target === window && [" ", "Enter"].includes(event.key)) {
        event.preventDefault();
        if (restricted) return;
        hold = !hold;
        window.dataset.held = String(hold);
        reconcile();
        return;
      }
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[next].focus({ preventScroll: true });
    };
    const stop = observeMotion(el, (show, limit) => {
      visible = show;
      restricted = limit;
      reconcile();
    });
    const size = new ResizeObserver(() => {
      if (!animation) return;
      const width = half.getBoundingClientRect().width;
      if (!width || Math.abs(width - distance) < 0.5) return;
      const fraction = (Number(animation.currentTime) % duration) / duration;
      distance = width;
      duration = (width / 24) * 1000;
      animation.effect?.updateTiming({ duration });
      animation.currentTime = fraction * duration;
    });
    size.observe(half);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);
    window.addEventListener("click", click);
    window.addEventListener("focusin", focusIn);
    window.addEventListener("focusout", focusOut);
    window.addEventListener("keydown", key);
    globalThis.addEventListener("scroll", clearTap, { passive: true });
    return () => {
      stop();
      size.disconnect();
      animation?.cancel();
      globalThis.removeEventListener("scroll", clearTap);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("click", click);
      window.removeEventListener("focusin", focusIn);
      window.removeEventListener("focusout", focusOut);
      window.removeEventListener("keydown", key);
    };
  }, [direction]);

  let index = 0;
  return (
    <div ref={root} className="technology-marquee" data-direction={direction}>
      <span id={`marquee-guide-${direction}`} className="sr-only">
        Use Enter or Space on the track to keep it still. Arrow keys explore the
        tools.
      </span>
      <div
        className="marquee-window"
        role="region"
        tabIndex={0}
        aria-label={`${trackName} technology track`}
        aria-describedby={`marquee-guide-${direction}`}
      >
        <div className="marquee-track">
          {[false, true].map((copy) => (
            <div
              key={String(copy)}
              className={`marquee-half ${copy ? "marquee-copy" : "marquee-live"}`}
              aria-hidden={copy || undefined}
            >
              {Object.entries(skills).map(([category, names]) => (
                <div className="marquee-category" key={category}>
                  <span>{category} ·</span>
                  {names.map((name) => (
                    <SkillIcon
                      key={name}
                      name={name}
                      decorative={copy}
                      managed
                      tabIndex={copy ? undefined : index++ === 0 ? 0 : -1}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
