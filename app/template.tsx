"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * An ordinary keyed route scene lets CSS animate new pages without invoking
 * document.startViewTransition (which aborts on viewport changes).
 * Next.js owns navigation, history, focus, and scroll behavior.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="route-scene" key={pathname}>
      {children}
    </div>
  );
}
