import type { Metadata } from "next";
import LostRoute from "@/components/LostRoute";
export const metadata: Metadata = {
  title: "404 — Find a new connection",
  description:
    "A missing route in the J0hnvexcoder portfolio. Find a real project, explore the work, or return home.",
  alternates: { canonical: "/404/" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};
export default function NotFound() {
  return <LostRoute />;
}
