import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n";
import type { PublicationStatus, StampAvailability } from "@/types/domain";

export function PublicStatusBadge({ status }: { status: PublicationStatus }) {
  const t = useT();
  if (status === "published") return null;
  const label = t.publicStatus[status] ?? t.statuses[status];
  return <Badge variant={status === "needs_update" ? "amber" : "stamp"}>{label}</Badge>;
}

export function AvailabilityBadge({ availability }: { availability: StampAvailability }) {
  const t = useT();
  const variant = availability === "available" ? "moss" : availability === "temporarily_unavailable" ? "stamp" : "muted";
  return <Badge variant={variant}>{t.availability[availability]}</Badge>;
}

export function DemoBadge() {
  const t = useT();
  return <Badge variant="demo">{t.app.demoBadge}</Badge>;
}

export function AdminStatusBadge({ status }: { status: PublicationStatus }) {
  const t = useT();
  const variant = (
    {
      draft: "muted",
      pending_review: "ink",
      published: "moss",
      needs_update: "amber",
      temporarily_unavailable: "stamp",
      archived: "outline",
    } as const
  )[status];
  return <Badge variant={variant}>{t.statuses[status]}</Badge>;
}
