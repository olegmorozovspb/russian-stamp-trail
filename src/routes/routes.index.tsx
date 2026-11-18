import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Check, Compass, Plus } from "lucide-react";
import { Container, Notice, PageHeader, SectionHeader } from "@/components/common/page";
import { SearchField } from "@/components/common/controls";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { RouteCard } from "@/components/catalog/cards";
import { RouteStopsList, RouteSummaryPanel } from "@/components/catalog/RouteStopsList";
import { RouteMap } from "@/components/map/RouteMap";
import type { StampMapHandle } from "@/components/map/StampMap";
import { Button } from "@/components/ui/button";
import { curatedRoutesQuery, mapQuery } from "@/services/queries";
import { filterPlaceItems, type PlaceItem } from "@/services/catalog-logic";
import { useRouteBuilder } from "@/stores/route-builder";
import { useT } from "@/i18n";

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: "Маршруты — Карта туристических печатей России" },
      { name: "description", content: "Конструктор маршрутов по местам получения туристических печатей и готовые маршруты." },
      { property: "og:title", content: "Маршруты за туристическими печатями" },
      { property: "og:description", content: "Соберите точки, расставьте порядок и откройте маршрут в навигаторе." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(mapQuery), context.queryClient.ensureQueryData(curatedRoutesQuery)]),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: RoutesPage,
});

function RoutesPage() {
  const t = useT();
  const { data: map } = useSuspenseQuery(mapQuery);
  const { data: curated } = useSuspenseQuery(curatedRoutesQuery);
  const { stops, has, add, remove, move, clear } = useRouteBuilder();
  const [q, setQ] = useState("");
  const mapRef = useRef<StampMapHandle>(null);

  const byId = useMemo(() => new Map(map.places.map((p) => [p.place.id, p])), [map.places]);
  const stopItems = stops.map((s) => byId.get(s.placeId)).filter((p): p is PlaceItem => !!p);
  const candidates = useMemo(() => filterPlaceItems(map.places, { query: q }).slice(0, q ? 20 : 8), [map.places, q]);

  const focus = (p: PlaceItem) => {
    mapRef.current?.focus(p.place.location.lat, p.place.location.lng, 15);
    document.getElementById("route-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Container>
      <PageHeader title={t.routes.title} lead={t.routes.lead} />

      <section className="mb-12">
        <SectionHeader title={t.routes.myRoute} hint={t.routes.localNote} />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            {stopItems.length === 0 ? (
              <EmptyState icon={<Compass className="size-6" />} title={t.routes.emptyTitle} text={t.routes.emptyText} />
            ) : (
              <>
                <RouteStopsList stops={stopItems} editable onMove={move} onRemove={remove} onFocus={focus} />
                <div className="surface p-4">
                  <RouteSummaryPanel stops={stopItems} />
                </div>
                <Button variant="ghost" size="sm" onClick={clear} className="text-stamp hover:text-stamp">
                  {t.routes.clear}
                </Button>
              </>
            )}
          </div>
          <div id="route-map" className="space-y-2">
            {stopItems.length > 0 ? (
              <RouteMap stops={stopItems} mapRef={mapRef} />
            ) : (
              <div className="grid h-72 place-items-center rounded-lg border border-dashed border-border paper-grain p-6 text-center text-sm text-muted-foreground lg:h-[420px]">
                {t.routes.emptyText}
              </div>
            )}
            <Notice tone="ink">{t.routes.straightLineNote}</Notice>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-xl font-bold">{t.routes.addPoints}</h3>
          <SearchField label={t.routes.addSearch} value={q} onChange={setQ} placeholder={t.routes.addSearch} className="mb-3 max-w-md" />
          {candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.routes.noResults}</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((p) => {
                const added = has(p.place.id);
                return (
                  <li key={p.place.id} className="surface flex items-center gap-2 p-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display font-bold">{p.place.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{p.city.name}</div>
                    </div>
                    <Button size="sm" variant={added ? "soft" : "paper"} disabled={added} onClick={() => add(p.place.id)}>
                      {added ? <Check /> : <Plus />}
                      {added ? t.routes.added : t.routes.add}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title={t.routes.curated} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {curated.map((r) => <RouteCard key={r.route.id} summary={r} />)}
        </div>
      </section>
    </Container>
  );
}
