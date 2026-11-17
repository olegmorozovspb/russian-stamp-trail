import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Map as MapIcon, Search, Stamp } from "lucide-react";
import heroImage from "@/assets/hero-passport.jpg";
import { Button } from "@/components/ui/button";
import { Container, DemoNotice, SectionHeader } from "@/components/common/page";
import { ErrorState, LoadingState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { CityCard, PassportCard, RouteCard } from "@/components/catalog/cards";
import { homeQuery } from "@/services/queries";
import { useT } from "@/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Карта туристических печатей России — все печати на одной карте" },
      { name: "description", content: "Находите туристические печати в городах России, узнавайте условия и часы работы, стройте маршруты и собирайте коллекцию." },
      { property: "og:title", content: "Карта туристических печатей России" },
      { property: "og:description", content: "Все туристические печати России на одной карте." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const { data } = useSuspenseQuery(homeQuery);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <>
      <section className="relative overflow-hidden border-b border-border paper-grain">
        <img
          src={heroImage}
          alt=""
          width={1600}
          height={1008}
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[62%] object-cover object-left opacity-95 md:block [mask-image:linear-gradient(to_right,transparent,black_30%)]"
        />
        <Container className="relative py-10 sm:py-16 md:py-24">
          <div className="max-w-xl animate-fade-up space-y-5">
            <div className="eyebrow">{t.home.eyebrow}</div>
            <h1 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl md:text-6xl">
              Карта туристических <span className="text-primary">печатей</span> России
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">{t.home.lead}</p>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/catalog", search: { q: q.trim() || undefined } });
              }}
              className="surface flex items-center gap-2 p-1.5 shadow-[var(--shadow-lift)]"
            >
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">{t.common.search}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.home.searchPlaceholder}
                  className="h-11 w-full rounded-md bg-transparent pl-9 pr-2 text-base outline-none"
                />
              </label>
              <Button type="submit" size="lg">
                {t.home.searchSubmit}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="paper" size="lg">
                <Link to="/map">
                  <MapIcon />
                  {t.home.openMap}
                </Link>
              </Button>
              <Button asChild variant="paper" size="lg">
                <Link to="/collection">
                  <Stamp />
                  {t.home.myCollection}
                </Link>
              </Button>
            </div>
          </div>
          <img src={heroImage} alt="" width={1600} height={1008} className="mt-8 aspect-[16/10] w-full rounded-lg object-cover md:hidden" />
        </Container>
      </section>

      <Container className="space-y-14 pt-8">
        <DemoNotice />

        <section>
          <SectionHeader title={t.home.citiesTitle} hint={t.home.citiesHint} link={{ label: t.common.showAll, to: "/catalog" }} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.cities.map((c) => (
              <CityCard key={c.city.id} summary={c} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.newTitle} link={{ label: t.common.showAll, to: "/catalog", search: { sort: "date" } }} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.newStamps.map((it) => (
              <StampCard key={it.stamp.id} item={it} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.routesTitle} link={{ label: t.common.showAll, to: "/routes" }} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.routes.map((r) => (
              <RouteCard key={r.route.id} summary={r} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.passportsTitle} link={{ label: t.common.showAll, to: "/passports" }} />
          <div className="grid gap-4 md:grid-cols-2">
            {data.passports.map((p) => (
              <PassportCard key={p.passport.id} summary={p} />
            ))}
          </div>
        </section>

        <section className="surface overflow-hidden">
          <div className="grid md:grid-cols-[1fr_2fr]">
            <div className="border-b border-border bg-primary p-6 text-primary-foreground md:border-b-0 md:border-r">
              <h2 className="text-3xl font-extrabold">{t.home.howTitle}</h2>
              <p className="mt-2 text-sm opacity-85">{t.app.tagline}.</p>
            </div>
            <ol className="grid gap-px bg-border sm:grid-cols-2">
              {t.home.how.map((step, i) => (
                <li key={step.title} className="flex gap-3 bg-card p-5">
                  <span className="grid size-9 shrink-0 -rotate-6 place-items-center rounded-full border-2 border-dashed border-stamp font-display text-lg font-bold text-stamp">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Container>
    </>
  );
}
