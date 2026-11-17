import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Container, PageHeader, SectionHeader } from "@/components/common/page";
import { EmptyState, ErrorState, LoadingState, NotFoundState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { PassportCard, RouteCard } from "@/components/catalog/cards";
import { PlacesMiniMap } from "@/components/map/PlacesMiniMap";
import { Badge } from "@/components/ui/badge";
import { cityQuery } from "@/services/queries";
import { useT } from "@/i18n";

export const Route = createFileRoute("/city/$cityId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(cityQuery(params.cityId));
    if (!data) throw notFound();
    return { name: data.city.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Туристические печати: ${loaderData.name}` },
          { name: "description", content: `Где получить туристические печати в городе ${loaderData.name}: места, условия, паспорта и маршруты.` },
          { property: "og:title", content: `Туристические печати — ${loaderData.name}` },
          { property: "og:description", content: "Места, условия получения, паспорта и маршруты." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Город недоступен" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: CityPage,
});

function CityPage() {
  const t = useT();
  const { cityId } = Route.useParams();
  const { data } = useSuspenseQuery(cityQuery(cityId));
  if (!data) return <NotFoundState />;
  const { city, region, stamps, places, passports, routes } = data;

  return (
    <Container>
      <PageHeader
        eyebrow={
          region && region.name !== city.name ? (
            <Link to="/region/$regionId" params={{ regionId: region.id }} className="hover:text-primary">{region.name}</Link>
          ) : (
            t.common.city
          )
        }
        title={city.name}
        lead={city.description}
      >
        <Badge variant="ink">{t.city.published(stamps.length)}</Badge>
      </PageHeader>

      <div className="space-y-12">
        {places.length > 0 && (
          <section>
            <SectionHeader title={t.city.map} />
            <PlacesMiniMap places={places} />
          </section>
        )}
        <section>
          <SectionHeader title={t.city.stampsTitle} />
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
            <SectionHeader title={t.city.passports} />
            <div className="grid gap-4 md:grid-cols-2">
              {passports.map((p) => <PassportCard key={p.passport.id} summary={p} />)}
            </div>
          </section>
        )}
        {routes.length > 0 && (
          <section>
            <SectionHeader title={t.city.routes} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((r) => <RouteCard key={r.route.id} summary={r} />)}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
