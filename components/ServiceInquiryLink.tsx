import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function ServiceInquiryLink({
  service,
  label = "Discuss Your Project",
  className = "button primary",
  location = "service-detail",
}: {
  service?: string;
  label?: string;
  className?: string;
  location?: "service-hero" | "service-footer" | "service-detail";
}) {
  return (
    <Link
      prefetch={false}
      className={className}
      data-ga-event="service_inquiry_click"
      data-ga-service-id={service || "overview"}
      data-ga-location={location}
      href={
        service
          ? `/contact/?service=${encodeURIComponent(service)}`
          : "/contact/"
      }
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
