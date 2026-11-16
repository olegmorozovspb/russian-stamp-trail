import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MapPin, Route as RouteIcon } from "lucide-react";
import type { CitySummary, PassportSummary, RouteSummary } from "@/services/catalog";
import { useT } from "@/i18n";
import { DemoBadge } from "./badges";

export function CityCard({ summary }: { summary: CitySummary }) {
  const t = useT();
  return (
    <Link
      to="/city/$cityId"
      params={{ cityId: summary.city.id }}
      className="surface group flex items-center gap-3 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="stamp-ring grid size-12 shrink-0 place-items-center font-display text-lg font-bold text-primary">
        {summary.city.name.slice(0, 1)}
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-lg font-bold leading-tight group-hover:text-primary">{summary.city.name}</div>
        <div className="truncate text-xs text-muted-foreground">{t.common.stamps(summary.stampCount)}</div>
      </div>
    </Link>
  );
}

export function PassportCard({ summary, collected }: { summary: PassportSummary; collected?: number }) {
  const t = useT();
  const p = summary.passport;
  return (
    <Link
      to="/passports/$passportId"
      params={{ passportId: p.id }}
      className="surface group flex gap-4 overflow-hidden p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="w-20 shrink-0 overflow-hidden rounded-md bg-paper-deep sm:w-24">
        {p.coverImage ? (
          <img src={p.coverImage.url} alt={p.coverImage.alt} loading="lazy" width={240} height={320} className="aspect-[3/4] h-full w-full object-cover" />
        ) : (
          <div className="grid aspect-[3/4] place-items-center text-primary">
            <BookOpen />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap gap-1.5">{p.isDemo && <DemoBadge />}</div>
        <h3 className="text-lg font-bold leading-snug group-hover:text-primary">{p.name}</h3>
        <p className="text-sm text-muted-foreground">{p.geography}</p>
        <p className="mt-auto text-sm font-medium">
          {collected !== undefined ? t.passports.progress(collected, summary.stampCount) : t.common.stamps(summary.stampCount)}
        </p>
      </div>
    </Link>
  );
}

export function RouteCard({ summary }: { summary: RouteSummary }) {
  const t = useT();
  return (
    <Link
      to="/routes/$routeId"
      params={{ routeId: summary.route.id }}
      className="surface group flex flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <RouteIcon className="size-4" />
          {t.common.points(summary.stops.length)}
        </span>
        {summary.route.isDemo && <DemoBadge />}
      </div>
      <h3 className="text-lg font-bold leading-snug group-hover:text-primary">{summary.route.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{summary.route.description}</p>
      <ol className="mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
        {summary.cities.map((c, i) => (
          <li key={c.id} className="inline-flex items-center gap-1">
            {i > 0 && <ArrowRight className="size-3" />}
            <MapPin className="size-3" />
            {c.name}
          </li>
        ))}
      </ol>
    </Link>
  );
}
