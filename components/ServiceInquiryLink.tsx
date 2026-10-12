"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function ServiceInquiryLink({
  service,
  label = "Discuss Your Project",
  className = "button primary",
}: {
  service?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      className={className}
      href={
        service
          ? `/?service=${encodeURIComponent(service)}#contact`
          : "/#contact"
      }
      onClick={() => {
        if (service)
          window.dispatchEvent(
            new CustomEvent("portfolio-enquiry", { detail: service }),
          );
      }}
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
