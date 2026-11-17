import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Stamp } from "lucide-react";
import { Container, Notice, PageHeader } from "@/components/common/page";
import { ProgressBar, SelectField } from "@/components/common/controls";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { Button } from "@/components/ui/button";
import { catalogQuery } from "@/services/queries";
import { collectionProgress, type ProgressRow } from "@/services/catalog-logic";
import { useCollection } from "@/stores/collection";
import { useT } from "@/i18n";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Моя коллекция — Карта туристических печатей России" },
      { name: "description", content: "Собранные туристические печати и прогресс по городам и регионам." },
      { property: "og:title", content: "Моя коллекция туристических печатей" },
      { property: "og:description", content: "Прогресс по городам и регионам." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: CollectionPage,
});

function ProgressList({ title, rows }: { title: string; rows: ProgressRow[] }) {
  return (
    <section className="surface p-4">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="space-y-1">
            <div className="flex justify-between gap-2 text-sm">
              <span className="truncate font-medium">{r.name}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{r.collected} / {r.total}</span>
            </div>
            <ProgressBar value={r.collected} max={r.total} label={`${r.name}: ${r.collected} из ${r.total}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CollectionPage() {
  const t = useT();
  const { data } = useSuspenseQuery(catalogQuery);
  const { ids } = useCollection();
  const [region, setRegion] = useState("");

  const collectedItems = useMemo(() => data.items.filter((i) => ids.has(i.stamp.id)), [data.items, ids]);
  const shown = collectedItems.filter((i) => !region || i.region.id === region);
  const byCity = useMemo(() => collectionProgress(data.items, ids, "city").filter((r) => r.collected > 0), [data.items, ids]);
  const byRegion = useMemo(() => collectionProgress(data.items, ids, "region").filter((r) => r.collected > 0), [data.items, ids]);
  const regionsWithCollected = data.regions.filter((r) => collectedItems.some((i) => i.region.id === r.id));

  return (
    <Container>
      <PageHeader title={t.collection.title} />
      <Notice tone="ink" className="mb-6">{t.collection.localNote}</Notice>

      <div className="surface mb-6 flex items-center gap-5 p-5">
        <div className="grid size-20 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-dashed border-stamp text-stamp">
          <span className="font-display text-3xl font-extrabold tabular-nums">{collectedItems.length}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-lg font-bold">{t.collection.total}</div>
          <div className="text-sm text-muted-foreground">{t.collection.ofCatalog(data.items.length)}</div>
          <ProgressBar value={collectedItems.length} max={data.items.length} label={t.collection.total} />
        </div>
      </div>

      {collectedItems.length === 0 ? (
        <EmptyState
          icon={<Stamp className="size-6" />}
          title={t.collection.emptyTitle}
          text={t.collection.emptyText}
          action={
            <Button asChild>
              <Link to="/catalog">{t.collection.toCatalog}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            <ProgressList title={t.collection.byRegion} rows={byRegion} />
            <ProgressList title={t.collection.byCity} rows={byCity} />
          </div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold">{t.collection.collected}</h2>
            <SelectField label={t.common.region} value={region} onChange={(e) => setRegion(e.target.value)} className="w-56">
              <option value="">{t.collection.filterAll}</option>
              {regionsWithCollected.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </SelectField>
          </div>
          {shown.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((it) => <StampCard key={it.stamp.id} item={it} />)}
            </div>
          ) : (
            <EmptyState title={t.collection.noMatch} />
          )}
        </>
      )}
    </Container>
  );
}
