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
          ? `/contact/?service=${encodeURIComponent(service)}`
          : "/contact/"
      }
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
