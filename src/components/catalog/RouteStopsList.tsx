import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ExternalLink, Map as MapIcon, Trash2 } from "lucide-react";
import { googleRouteUrl, totalStraightLineKm, yandexRouteUrl } from "@/lib/route-logic";
import type { PlaceItem } from "@/services/catalog-logic";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";

export function RouteStopsList({
  stops,
  editable,
  onMove,
  onRemove,
  onFocus,
}: {
  stops: PlaceItem[];
  editable?: boolean;
  onMove?: (index: number, dir: -1 | 1) => void;
  onRemove?: (placeId: string) => void;
  onFocus?: (p: PlaceItem) => void;
}) {
  const t = useT();
  return (
    <ol className="space-y-2">
      {stops.map((p, i) => (
        <li key={p.place.id} className="surface flex items-center gap-3 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <Link to="/place/$placeId" params={{ placeId: p.place.id }} className="block truncate font-display text-base font-bold hover:text-primary">
              {p.place.name}
            </Link>
            <div className="truncate text-xs text-muted-foreground">
              {p.city.name} · {t.common.stamps(p.stamps.length)}
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            {onFocus && (
              <Button variant="ghost" size="icon" aria-label={`${t.routes.showOnMap}: ${p.place.name}`} onClick={() => onFocus(p)}>
                <MapIcon />
              </Button>
            )}
            {editable && (
              <>
                <Button variant="ghost" size="icon" aria-label={t.routes.moveUp} disabled={i === 0} onClick={() => onMove?.(i, -1)}>
                  <ArrowUp />
                </Button>
                <Button variant="ghost" size="icon" aria-label={t.routes.moveDown} disabled={i === stops.length - 1} onClick={() => onMove?.(i, 1)}>
                  <ArrowDown />
                </Button>
                <Button variant="ghost" size="icon" aria-label={t.routes.remove} onClick={() => onRemove?.(p.place.id)} className="text-stamp hover:text-stamp">
                  <Trash2 />
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Straight-line distance (clearly labeled) + links to external navigators. */
export function RouteSummaryPanel({ stops }: { stops: PlaceItem[] }) {
  const t = useT();
  const points = stops.map((p) => p.place.location);
  if (points.length < 2) {
    return <p className="text-sm text-muted-foreground">{t.routes.needTwo}</p>;
  }
  const km = totalStraightLineKm(points);
  return (
    <div className="space-y-3">
      <div>
        <div className="font-semibold">{t.routes.straightLine(km < 10 ? km.toFixed(1) : Math.round(km).toString())}</div>
        <p className="mt-1 text-xs text-muted-foreground">{t.routes.straightLineNote}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={yandexRouteUrl(points)} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
            {t.routes.openYandex}
          </a>
        </Button>
        <Button asChild size="sm" variant="paper">
          <a href={googleRouteUrl(points)} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
            {t.routes.openGoogle}
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t.routes.externalNote}</p>
    </div>
  );
}
