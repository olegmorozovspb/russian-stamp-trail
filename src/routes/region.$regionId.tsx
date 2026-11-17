import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Container, PageHeader, SectionHeader } from "@/components/common/page";
import { EmptyState, ErrorState, LoadingState, NotFoundState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { CityCard, PassportCard } from "@/components/catalog/cards";
import { PlacesMiniMap } from "@/components/map/PlacesMiniMap";
import { Badge } from "@/components/ui/badge";
import { regionQuery } from "@/services/queries";
import { useT } from "@/i18n";

export const Route = createFileRoute("/region/$regionId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(regionQuery(params.regionId));
    if (!data) throw notFound();
    return { name: data.region.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Туристические печати региона: ${loaderData.name}` },
          { name: "description", content: `Города, места и туристические паспорта региона ${loaderData.name}.` },
          { property: "og:title", content: `Печати региона — ${loaderData.name}` },
          { property: "og:description", content: "Города, печати и связанные туристические проекты." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Регион недоступен" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: RegionPage,
});

function RegionPage() {
  const t = useT();
  const { regionId } = Route.useParams();
  const { data } = useSuspenseQuery(regionQuery(regionId));
  if (!data) return <NotFoundState />;
  const { region, cities, stamps, places, passports } = data;

  return (
    <Container>
      <PageHeader eyebrow={t.common.region} title={region.name} lead={region.description}>
        <Badge variant="ink">{t.city.published(stamps.length)}</Badge>
      </PageHeader>
      <div className="space-y-12">
        <section>
          <SectionHeader title={t.region.cities} />
          {cities.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {cities.map((c) => <CityCard key={c.city.id} summary={c} />)}
            </div>
          ) : (
            <EmptyState title={t.region.noCities} />
          )}
        </section>
        {places.length > 0 && (
          <section>
            <SectionHeader title={t.city.map} />
            <PlacesMiniMap places={places} />
          </section>
        )}
        <section>
          <SectionHeader title={t.region.stamps} />
          {stamps.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stamps.map((s) => <StampCard key={s.stamp.id} item={s} />)}
            </div>
          ) : (
            <EmptyState title={t.city.noStamps} />
          )}
        </section>
        {passports.length > 0 && (
          <section>
            <SectionHeader title={t.region.passports} />
            <div className="grid gap-4 md:grid-cols-2">
              {passports.map((p) => <PassportCard key={p.passport.id} summary={p} />)}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
