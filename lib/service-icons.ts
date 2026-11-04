import {
  Code2,
  RefreshCw,
  Search,
  Layers,
  ContactRound,
  PanelsTopLeft,
  UserRound,
  CalendarDays,
  Workflow,
} from "lucide-react";
// Stable identifiers keep homepage and hub icons aligned as services are added.
export const serviceIcons = {
  "business-websites": Code2,
  "website-redesign": RefreshCw,
  "technical-seo": Search,
  "cms-solutions": Layers,
  "crm-development": ContactRound,
  "admin-dashboard-development": PanelsTopLeft,
  "portfolio-websites": UserRound,
  "booking-systems": CalendarDays,
  "custom-solutions": Workflow,
};
export const serviceIcon = (id: string) =>
  serviceIcons[id as keyof typeof serviceIcons] ?? Workflow;
