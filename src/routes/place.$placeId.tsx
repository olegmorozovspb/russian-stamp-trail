import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, CalendarCheck, Clock, ExternalLink, Map as MapIcon, MapPin, TriangleAlert } from "lucide-react";
import { Container, Notice } from "@/components/common/page";
import { ErrorState, LoadingState, NotFoundState } from "@/components/common/states";
import { AvailabilityBadge, DemoBadge, PublicStatusBadge } from "@/components/catalog/badges";
import { AddToRouteButton, CollectButton } from "@/components/catalog/actions";
import { OpeningHoursTable } from "@/components/catalog/OpeningHoursTable";
import { Button } from "@/components/ui/button";
import { placeQuery } from "@/services/queries";
import type { Passport, Stamp } from "@/types/domain";
import { formatDate, useT } from "@/i18n";
import { osmPointUrl } from "@/lib/route-logic";
import { useCollection } from "@/stores/collection";

export const Route = createFileRoute("/place/$placeId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(placeQuery(params.placeId));
    if (!data) throw notFound();
    return { title: data.place.name, city: data.city.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — печати, ${loaderData.city}` },
          { name: "description", content: `Где и как получить туристическую печать: ${loaderData.title}, ${loaderData.city}. Условия, стоимость, часы работы.` },
          { property: "og:title", content: `${loaderData.title} — ${loaderData.city}` },
          { property: "og:description", content: "Условия получения печати, часы работы и связанные паспорта." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Место недоступно" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: PlacePage,
});

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0">
        <div className="eyebrow">{label}</div>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

function PlacePage() {
  const t = useT();
  const { placeId } = Route.useParams();
  const { data } = useSuspenseQuery(placeQuery(placeId));
  if (!data) return <NotFoundState />;
  const { place, organization, city, region, stamps, passports, stampPassports, otherPlacesOfOrg } = data;
  const photo = place.photos[0];
  const passportById = new Map(passports.map((p) => [p.id, p]));

  return (
    <Container className="pt-4">
      <nav aria-label="Навигационная цепочка" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/region/$regionId" params={{ regionId: region.id }} className="hover:text-primary">{region.name}</Link>
        {city.name !== region.name && (
          <>
            <span aria-hidden>/</span>
            <Link to="/city/$cityId" params={{ cityId: city.id }} className="hover:text-primary">{city.name}</Link>
          </>
        )}
      </nav>

      <header className="animate-fade-up space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{t.orgTypes[organization.type]}</span>
          {place.isDemo && <DemoBadge />}
          <PublicStatusBadge status={place.status} />
        </div>
        {/* 1. Venue name always comes first */}
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{place.name}</h1>
      </header>

      {place.isDemo && <Notice className="mt-4">{t.place.demoWarning}</Notice>}

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {photo && (
            <figure className="overflow-hidden rounded-lg border border-border">
              <img src={photo.url} alt={photo.alt} width={1200} height={800} className="aspect-[16/9] w-full object-cover" />
              {photo.credit && <figcaption className="bg-card px-3 py-1.5 text-xs text-muted-foreground">{photo.credit}</figcaption>}
            </figure>
          )}

          {/* Location block on mobile appears before stamps */}
          <div className="lg:hidden">
            <LocationCard data={data} />
          </div>

          {place.temporaryNotice && (
            <div className="flex gap-3 rounded-lg border border-stamp/30 bg-stamp-soft p-4">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-stamp" />
              <div>
                <div className="font-semibold">{t.place.notice}</div>
                <p className="text-sm">{place.temporaryNotice}</p>
              </div>
            </div>
          )}

          <section aria-labelledby="stamps-h">
            <h2 id="stamps-h" className="mb-3 text-2xl font-bold">{t.place.stampsHere(stamps.length)}</h2>
            <div className="space-y-4">
              {stamps.map((s) => (
                <StampBlock key={s.id} stamp={s} passports={(stampPassports[s.id] ?? []).map((id) => passportById.get(id)).filter((p): p is Passport => !!p)} />
              ))}
            </div>
          </section>

          {otherPlacesOfOrg.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">{t.place.otherPlaces}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {otherPlacesOfOrg.map((p) => (
                  <li key={p.place.id}>
                    <Link to="/place/$placeId" params={{ placeId: p.place.id }} className="surface block p-3 hover:border-primary/40">
                      <div className="font-display font-bold">{p.place.name}</div>
                      <div className="text-xs text-muted-foreground">{p.city.name}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="hidden space-y-4 lg:block">
          <div className="sticky top-[calc(var(--header-h)+1rem)] space-y-4">
            <LocationCard data={data} />
          </div>
        </aside>
      </div>
    </Container>
  );
}

type PlaceData = NonNullable<Awaited<ReturnType<typeof import("@/services/catalog").catalogService.getPlace>>>;

function LocationCard({ data }: { data: PlaceData }) {
  const t = useT();
  const { place, city, region, organization } = data;
  return (
    <div className="surface space-y-4 p-4">
      <InfoRow icon={<MapPin className="size-4" />} label={`${t.common.city} и ${t.common.region.toLowerCase()}`}>
        <Link to="/city/$cityId" params={{ cityId: city.id }} className="font-medium text-primary hover:underline">{city.name}</Link>
        {city.name !== region.name && (
          <>
            {", "}
            <Link to="/region/$regionId" params={{ regionId: region.id }} className="text-primary hover:underline">{region.name}</Link>
          </>
        )}
      </InfoRow>
      <InfoRow icon={<MapPin className="size-4" />} label={t.place.address}>{place.address}</InfoRow>
      <InfoRow icon={<MapIcon className="size-4" />} label={t.place.coordinates}>
        <span className="tabular-nums">{place.location.lat.toFixed(5)}, {place.location.lng.toFixed(5)}</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="soft">
            <Link to="/map" search={{ place: place.id }}>
              <MapIcon />
              {t.place.openOnMap}
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={osmPointUrl(place.location)} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              OSM
            </a>
          </Button>
        </div>
      </InfoRow>
      <InfoRow icon={<Clock className="size-4" />} label={t.place.hours}>
        <OpeningHoursTable hours={place.openingHours} />
      </InfoRow>
      <InfoRow icon={<CalendarCheck className="size-4" />} label={t.place.lastVerified}>
        {place.lastVerifiedAt ? formatDate(place.lastVerifiedAt) : t.common.notVerified}
        <div className="text-xs text-muted-foreground">
          {t.place.source}: {place.source.name ?? t.common.unknown}
        </div>
      </InfoRow>
      <InfoRow icon={<BookOpen className="size-4" />} label={t.place.organization}>{organization.name}</InfoRow>
      <AddToRouteButton placeId={place.id} className="w-full" />
    </div>
  );
}

function StampBlock({ stamp, passports }: { stamp: Stamp; passports: Passport[] }) {
  const t = useT();
  const { ids } = useCollection();
  const collected = ids.has(stamp.id);
  const img = stamp.photos[0];
  const price =
    stamp.price.kind === "free" ? t.place.priceFree : stamp.price.kind === "paid" ? t.place.pricePaid(stamp.price.amount) : t.place.priceUnknown;

  return (
    <article id={stamp.id} className="surface scroll-mt-24 overflow-hidden">
      <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr]">
        <div className="relative mx-auto w-40 sm:w-full">
          {img && <img src={img.url} alt={img.alt} loading="lazy" width={320} height={320} className="perforated aspect-square w-full bg-paper-deep object-cover" />}
          {collected && <span className="collected-mark absolute -right-1 top-2 animate-stamp-press">{t.place.inCollection}</span>}
        </div>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{stamp.name ? `«${stamp.name}»` : <span className="text-muted-foreground">{t.catalog.unnamedStamp}</span>}</h3>
            <AvailabilityBadge availability={stamp.availability} />
            <PublicStatusBadge status={stamp.status} />
          </div>
          <div>
            <div className="eyebrow">{t.place.description}</div>
            <p className="mt-0.5 text-sm">{stamp.description}</p>
          </div>
          <div>
            <div className="eyebrow">{t.place.conditions}</div>
            {stamp.conditions.length ? (
              <ul className="mt-1 space-y-1 text-sm">
                {stamp.conditions.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <span className="shrink-0 rounded bg-primary-soft px-1.5 text-xs font-semibold leading-5 text-accent-foreground">{t.conditionTypes[c.type]}</span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t.place.noConditions}</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="eyebrow">{t.place.price}</div>
              <p className="mt-0.5 text-sm font-medium">{price}</p>
            </div>
            <div>
              <div className="eyebrow">{t.place.lastVerified}</div>
              <p className="mt-0.5 text-sm">{stamp.lastVerifiedAt ? formatDate(stamp.lastVerifiedAt) : t.common.notVerified}</p>
            </div>
          </div>
          <div>
            <div className="eyebrow">{t.place.passports}</div>
            {passports.length ? (
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {passports.map((p) => (
                  <li key={p.id}>
                    <Link to="/passports/$passportId" params={{ passportId: p.id }} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium hover:border-primary hover:text-primary">
                      <BookOpen className="size-3" />
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t.place.noPassports}</p>
            )}
          </div>
          <CollectButton stampId={stamp.id} className="w-full sm:w-auto" />
        </div>
      </div>
    </article>
  );
}
