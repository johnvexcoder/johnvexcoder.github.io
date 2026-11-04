"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
const focusable =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
/** Review-only modal: normal page stacking lets the SDK's external challenge stay interactive. */
export default function ReviewDialog({
  open,
  onClose,
  challengeOpen,
  children,
}: {
  open: boolean;
  onClose: () => void;
  challengeOpen: boolean;
  children: ReactNode;
}) {
  const [host] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );
  const surface = useRef<HTMLDivElement>(null);
  const id = useId();
  const challenge = useRef(challengeOpen);
  const close = useRef(onClose);
  useEffect(() => {
    challenge.current = challengeOpen;
    close.current = onClose;
  }, [challengeOpen, onClose]);
  useEffect(() => {
    if (!host || !open) return;
    host.setAttribute("class", "review-dialog-backdrop");
    document.body.append(host);
    return () => host.remove();
  }, [host, open]);
  useEffect(() => {
    if (!open || !host) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const background = Array.from(document.body.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        node !== host &&
        !["SCRIPT", "STYLE", "LINK"].includes(node.tagName) &&
        // Leave an already-loaded SDK challenge portal accessible, including a contact widget's portal.
        !node.querySelector(
          'iframe[src*="hcaptcha.com"][src*="frame=challenge"]',
        ),
    );
    const inert = background.map((node) => [node, node.inert] as const);
    background.forEach((node) => {
      node.inert = true;
    });
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      surface.current
        ?.querySelector<HTMLElement>(focusable)
        ?.focus({ preventScroll: true }),
    );
    const keydown = (event: KeyboardEvent) => {
      // The SDK owns focus and Escape while its external challenge is open.
      if (challenge.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        surface.current?.querySelectorAll<HTMLElement>(focusable) || [],
      ).filter((el) => el.getClientRects().length > 0);
      const first = items[0],
        last = items[items.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !surface.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !surface.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown, true);
      inert.forEach(([node, value]) => {
        node.inert = value;
      });
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, host]);
  if (!open || !host) return null;
  return createPortal(
    <div
      className="review-dialog-hit-area"
      onClick={(event) => {
        if (event.target === event.currentTarget && !challengeOpen) onClose();
      }}
    >
      <div
        ref={surface}
        className="dialog review-dialog"
        role="dialog"
        aria-modal={challengeOpen ? undefined : true}
        aria-labelledby={id}
      >
        <div className="dialog-surface">
          <header>
            <h2 id={id}>Share your experience</h2>
            <button
              type="button"
              className="icon-button"
              onClick={onClose}
              aria-label="Close share your experience"
            >
              <X size={20} />
            </button>
          </header>
          {children}
        </div>
      </div>
    </div>,
    host,
  );
}
