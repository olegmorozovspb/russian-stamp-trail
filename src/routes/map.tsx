import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Locate, MapPin, SlidersHorizontal, X } from "lucide-react";
import { StampMap, type MapMarker, type StampMapHandle } from "@/components/map/StampMap";
import { SearchField, SelectField } from "@/components/common/controls";
import { ErrorState, LoadingState } from "@/components/common/states";
import { AvailabilityBadge, DemoBadge } from "@/components/catalog/badges";
import { AddToRouteButton } from "@/components/catalog/actions";
import { Button } from "@/components/ui/button";
import { mapQuery } from "@/services/queries";
import { filterPlaceItems, type AvailabilityFilter, type PlaceItem } from "@/services/catalog-logic";
import type { OrganizationType } from "@/types/domain";
import { useCollection } from "@/stores/collection";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

interface MapSearch {
  place?: string;
}

export const Route = createFileRoute("/map")({
  validateSearch: (s: Record<string, unknown>): MapSearch => ({
    place: typeof s.place === "string" && s.place ? s.place : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Карта печатей — Карта туристических печатей России" },
      { name: "description", content: "Интерактивная карта мест, где можно получить туристические печати." },
      { property: "og:title", content: "Интерактивная карта туристических печатей" },
      { property: "og:description", content: "Маркеры мест получения печатей с фильтрами по типу, наличию и паспорту." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mapQuery),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: MapPage,
});

function MapPage() {
  const t = useT();
  const { data } = useSuspenseQuery(mapQuery);
  const { place: selectedId } = Route.useSearch();
  const navigate = useNavigate({ from: "/map" });
  const { ids: collectedIds } = useCollection();
  const mapRef = useRef<StampMapHandle>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OrganizationType | "">("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("");
  const [passportId, setPassportId] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const select = (id: string | undefined) => navigate({ search: { place: id }, replace: true });

  const filtered = useMemo(
    () => filterPlaceItems(data.places, { query, category, availability, passportId: passportId || undefined }),
    [data.places, query, category, availability, passportId],
  );
  const markers: MapMarker[] = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.place.id,
        lat: p.place.location.lat,
        lng: p.place.location.lng,
        title: `${p.place.name} — ${p.city.name}`,
        tone: p.stamps.every((s) => collectedIds.has(s.id))
          ? "collected"
          : p.stamps.some((s) => s.availability === "available")
            ? "default"
            : "muted",
      })),
    [filtered, collectedIds],
  );
  const selected = data.places.find((p) => p.place.id === selectedId) ?? null;
  const categories = useMemo(() => [...new Set(data.places.map((p) => p.organization.type))], [data.places]);
  const activeFilters = [category, availability, passportId].filter(Boolean).length;

  const filters = (
    <div className="grid gap-2">
      <SelectField label={t.map.category} value={category} onChange={(e) => setCategory(e.target.value as OrganizationType | "")}>
        <option value="">{t.common.all}</option>
        {categories.map((c) => (
          <option key={c} value={c}>{t.orgTypes[c]}</option>
        ))}
      </SelectField>
      <SelectField label={t.map.availability} value={availability} onChange={(e) => setAvailability(e.target.value as AvailabilityFilter)}>
        <option value="">{t.map.availabilityAll}</option>
        <option value="available">{t.map.availabilityAvailable}</option>
        <option value="unavailable">{t.map.availabilityUnavailable}</option>
      </SelectField>
      <SelectField label={t.map.passport} value={passportId} onChange={(e) => setPassportId(e.target.value)}>
        <option value="">{t.map.allPassports}</option>
        {data.passports.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </SelectField>
      {activeFilters > 0 && (
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => { setCategory(""); setAvailability(""); setPassportId(""); }}>
          {t.common.reset}
        </Button>
      )}
    </div>
  );

  return (
    <div className="relative flex h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h)-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-var(--header-h))]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[380px] shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="space-y-3 border-b border-border p-4">
          <h1 className="text-2xl font-extrabold">{t.map.title}</h1>
          <SearchField label={t.common.search} value={query} onChange={setQuery} placeholder={t.map.searchPlaceholder} />
          {filters}
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground" aria-live="polite">
          <span>{t.map.results(filtered.length)}</span>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 && (
            <li className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">{t.map.emptyTitle}</div>
              {t.map.emptyText}
            </li>
          )}
          {filtered.map((p) => (
            <li key={p.place.id}>
              <button
                type="button"
                onClick={() => select(p.place.id)}
                className={cn(
                  "w-full rounded-md border p-3 text-left transition-colors hover:border-primary/40",
                  p.place.id === selectedId ? "border-primary bg-primary-soft" : "border-border bg-card",
                )}
              >
                <div className="font-display text-base font-bold leading-tight">{p.place.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {p.city.name} · {t.orgTypes[p.organization.type]} · {t.common.stamps(p.stamps.length)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative min-w-0 flex-1">
        <StampMap ref={mapRef} markers={markers} selectedId={selectedId} onSelect={select} className="absolute inset-0" />

        {/* Mobile search + filters overlay */}
        <div className="absolute inset-x-3 top-3 z-[500] space-y-2 lg:hidden">
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-md shadow-[var(--shadow-lift)]">
              <SearchField label={t.common.search} value={query} onChange={setQuery} placeholder={t.map.searchPlaceholder} />
            </div>
            <Button
              variant="paper"
              className="h-10 shadow-[var(--shadow-lift)]"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <SlidersHorizontal />
              <span className="sr-only sm:not-sr-only">{t.map.filters}</span>
              {activeFilters > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeFilters}</span>}
            </Button>
          </div>
          {filtersOpen && <div className="surface p-3">{filters}</div>}
          <div className="inline-flex rounded-full bg-card/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow" aria-live="polite">
            {filtered.length === 0 ? t.map.emptyTitle : t.map.results(filtered.length)}
          </div>
        </div>

        <Button
          variant="paper"
          size="sm"
          onClick={() => mapRef.current?.resetView()}
          aria-label={t.map.resetViewLabel}
          className={cn("absolute right-3 top-[6.5rem] z-[500] shadow-[var(--shadow-lift)] lg:bottom-6 lg:top-auto", filtersOpen && "hidden lg:inline-flex")}
        >
          <Locate />
          {t.map.resetView}
        </Button>

        {selected && <SelectedPlaceCard item={selected} onClose={() => select(undefined)} />}
      </div>
    </div>
  );
}

function SelectedPlaceCard({ item, onClose }: { item: PlaceItem; onClose: () => void }) {
  const t = useT();
  const photo = item.place.photos[0];
  return (
    <div className="surface absolute inset-x-3 bottom-3 z-[600] animate-fade-up overflow-hidden lg:inset-x-auto lg:bottom-auto lg:left-4 lg:top-4 lg:w-[360px]">
      <div className="flex gap-3 p-3">
        {photo && <img src={photo.url} alt={photo.alt} width={96} height={96} className="size-20 shrink-0 rounded-md object-cover sm:size-24" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="eyebrow truncate">{t.orgTypes[item.organization.type]}</div>
            <button type="button" onClick={onClose} aria-label={t.map.closeCard} className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted">
              <X className="size-4" />
            </button>
          </div>
          <h2 className="text-lg font-bold leading-tight">{item.place.name}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {item.city.name}, {item.region.name}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.place.isDemo && <DemoBadge />}
            <AvailabilityBadge availability={item.stamps.some((s) => s.availability === "available") ? "available" : item.stamps[0].availability} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border bg-muted/40 p-2">
        <Button asChild size="sm" className="flex-1">
          <Link to="/place/$placeId" params={{ placeId: item.place.id }}>
            {t.map.openPlace} · {t.common.stamps(item.stamps.length)}
            <ArrowRight />
          </Link>
        </Button>
        <AddToRouteButton placeId={item.place.id} size="sm" />
      </div>
    </div>
  );
}
