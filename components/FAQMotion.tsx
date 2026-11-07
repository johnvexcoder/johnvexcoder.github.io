"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FAQMotion() {
  const path = usePathname();
  useEffect(() => {
    if (!document.querySelector(".service-faq")) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const owned = new Set<HTMLDetailsElement>();
    const timers = new Map<HTMLDetailsElement, ReturnType<typeof setTimeout>>();
    const details = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest<HTMLDetailsElement>(".service-faq details")
        : null;
    const clear = (d: HTMLDetailsElement) => {
      clearTimeout(timers.get(d));
      timers.delete(d);
    };
    const later = (
      d: HTMLDetailsElement,
      delay: number,
      action: () => void,
    ) => {
      clear(d);
      timers.set(
        d,
        setTimeout(() => {
          timers.delete(d);
          action();
        }, delay),
      );
    };
    const over = (e: PointerEvent) => {
      const d = details(e.target);
      if (
        !d ||
        !fine.matches ||
        e.pointerType !== "mouse" ||
        !(e.target instanceof Element) ||
        !e.target.closest("summary")
      )
        return;
      if (d.contains(e.relatedTarget as Node | null)) return;
      clear(d);
      if (d.open) return;
      later(d, 220, () => {
        if (d.open || !d.isConnected) return;
        owned.add(d);
        d.open = true;
      });
    };
    const out = (e: PointerEvent) => {
      const d = details(e.target);
      if (!d || d.contains(e.relatedTarget as Node | null)) return;
      clear(d);
      if (owned.has(d))
        later(d, 170, () => {
          if (!d.contains(document.activeElement)) {
            d.open = false;
            owned.delete(d);
          }
        });
    };
    const click = (e: MouseEvent) => {
      const d = details(e.target);
      if (!d || !(e.target instanceof Element) || !e.target.closest("summary"))
        return;
      clear(d);
      // The first intentional pointer activation keeps a hover preview open.
      // Enter/Space and later pointer activations retain native toggling.
      if (owned.delete(d) && e.detail > 0) e.preventDefault();
    };
    const blur = (e: FocusEvent) => {
      const d = details(e.target);
      if (
        d &&
        owned.has(d) &&
        !d.matches(":hover") &&
        !d.contains(e.relatedTarget as Node | null)
      ) {
        clear(d);
        owned.delete(d);
        d.open = false;
      }
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("click", click);
    document.addEventListener("focusout", blur);
    return () => {
      timers.forEach(clearTimeout);
      owned.forEach((d) => {
        d.open = false;
      });
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("click", click);
      document.removeEventListener("focusout", blur);
    };
  }, [path]);
  return null;
}
