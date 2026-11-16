import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { StampItem } from "@/services/catalog-logic";
import { useT } from "@/i18n";
import { useCollection } from "@/stores/collection";
import { cn } from "@/lib/utils";
import { AvailabilityBadge, DemoBadge, PublicStatusBadge } from "./badges";

export function StampCard({ item, view = "grid" }: { item: StampItem; view?: "grid" | "list" }) {
  const t = useT();
  const { ids } = useCollection();
  const collected = ids.has(item.stamp.id);
  const photo = item.stamp.photos[0] ?? item.place.photos[0];
  const list = view === "list";

  return (
    <Link
      to="/place/$placeId"
      params={{ placeId: item.place.id }}
      hash={item.stamp.id}
      className={cn(
        "surface group relative flex overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        list ? "flex-row items-stretch" : "flex-col",
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-paper-deep", list ? "w-28 sm:w-36" : "aspect-[4/3] w-full")}>
        {photo && (
          <img
            src={photo.url}
            alt={photo.alt}
            loading="lazy"
            width={600}
            height={450}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {collected && (
          <span className="collected-mark absolute right-2 top-2 animate-stamp-press">{t.place.inCollection}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="eyebrow">{t.orgTypes[item.organization.type]}</span>
          {item.stamp.isDemo && <DemoBadge />}
        </div>
        <h3 className="text-lg font-bold leading-snug group-hover:text-primary">{item.place.name}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {item.city.name}
            {item.city.name !== item.region.name && `, ${item.region.name}`}
          </span>
        </p>
        <p className={cn("text-sm text-foreground/80", list ? "line-clamp-1" : "line-clamp-2")}>
          {item.stamp.name ? <span className="font-semibold">«{item.stamp.name}». </span> : null}
          {item.stamp.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          <AvailabilityBadge availability={item.stamp.availability} />
          <PublicStatusBadge status={item.stamp.status} />
        </div>
      </div>
    </Link>
  );
}
