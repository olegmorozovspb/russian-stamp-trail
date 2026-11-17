import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Container, DemoNotice, PageHeader } from "@/components/common/page";
import { SearchField, SelectField } from "@/components/common/controls";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { Button } from "@/components/ui/button";
import { catalogQuery } from "@/services/queries";
import { filterStampItems, type CatalogSort } from "@/services/catalog-logic";
import type { OrganizationType } from "@/types/domain";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

interface CatalogSearch {
  q?: string;
  region?: string;
  city?: string;
  category?: OrganizationType;
  sort?: CatalogSort;
  view?: "grid" | "list";
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/catalog")({
  validateSearch: (s: Record<string, unknown>): CatalogSearch => ({
    q: str(s.q),
    region: str(s.region),
    city: str(s.city),
    category: str(s.category) as OrganizationType | undefined,
    sort: s.sort === "date" ? "date" : undefined,
    view: s.view === "list" ? "list" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Каталог печатей — Карта туристических печатей России" },
      { name: "description", content: "Каталог туристических печатей: поиск и фильтры по региону, городу и типу места." },
      { property: "og:title", content: "Каталог туристических печатей" },
      { property: "og:description", content: "Поиск и фильтры по региону, городу и категории места." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: CatalogPage,
});

function CatalogPage() {
  const t = useT();
  const { data } = useSuspenseQuery(catalogQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });
  const view = search.view ?? "grid";

  const update = (patch: Partial<CatalogSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const categories = useMemo(
    () => [...new Set(data.items.map((i) => i.organization.type))].sort((a, b) => t.orgTypes[a].localeCompare(t.orgTypes[b], "ru")),
    [data.items, t],
  );
  const cities = data.cities.filter((c) => !search.region || c.regionId === search.region);
  const items = useMemo(
    () =>
      filterStampItems(data.items, {
        query: search.q,
        regionId: search.region,
        cityId: search.city,
        category: search.category,
        sort: search.sort ?? "name",
      }),
    [data.items, search],
  );
  const hasFilters = !!(search.q || search.region || search.city || search.category);

  return (
    <Container>
      <PageHeader title={t.catalog.title} lead={t.catalog.lead} />
      <div className="surface sticky top-[calc(var(--header-h)+0.5rem)] z-20 mb-5 space-y-3 p-3">
        <SearchField
          label={t.common.search}
          value={search.q ?? ""}
          onChange={(v) => update({ q: v || undefined })}
          placeholder={t.catalog.searchPlaceholder}
        />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <SelectField label={t.common.region} value={search.region ?? ""} onChange={(e) => update({ region: e.target.value || undefined, city: undefined })}>
            <option value="">{t.catalog.allRegions}</option>
            {data.regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </SelectField>
          <SelectField label={t.common.city} value={search.city ?? ""} onChange={(e) => update({ city: e.target.value || undefined })}>
            <option value="">{t.catalog.allCities}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </SelectField>
          <SelectField label={t.common.category} value={search.category ?? ""} onChange={(e) => update({ category: (e.target.value || undefined) as OrganizationType | undefined })}>
            <option value="">{t.catalog.allCategories}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{t.orgTypes[c]}</option>
            ))}
          </SelectField>
          <SelectField label={t.common.sort} value={search.sort ?? "name"} onChange={(e) => update({ sort: e.target.value === "date" ? "date" : undefined })}>
            <option value="name">{t.catalog.sortName}</option>
            <option value="date">{t.catalog.sortDate}</option>
          </SelectField>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">{t.catalog.found(items.length)}</p>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => navigate({ search: { sort: search.sort, view: search.view }, replace: true })}>
              {t.common.reset}
            </Button>
          )}
          <div className="inline-flex rounded-md border border-border bg-card p-0.5" role="group" aria-label="Вид каталога">
            {(["grid", "list"] as const).map((v) => {
              const Icon = v === "grid" ? LayoutGrid : List;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  aria-label={v === "grid" ? t.catalog.viewGrid : t.catalog.viewList}
                  onClick={() => update({ view: v === "list" ? "list" : undefined })}
                  className={cn("grid size-8 place-items-center rounded text-muted-foreground", view === v && "bg-primary-soft text-primary")}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={t.catalog.emptyTitle}
          text={t.catalog.emptyText}
          action={<Button variant="paper" onClick={() => navigate({ search: {}, replace: true })}>{t.common.reset}</Button>}
        />
      ) : (
        <div className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2")}>
          {items.map((it) => (
            <StampCard key={it.stamp.id} item={it} view={view} />
          ))}
        </div>
      )}
      <DemoNotice className="mt-8" />
    </Container>
  );
}
