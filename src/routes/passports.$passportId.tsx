import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Container, Notice, SectionHeader } from "@/components/common/page";
import { ProgressBar } from "@/components/common/controls";
import { EmptyState, ErrorState, LoadingState, NotFoundState } from "@/components/common/states";
import { StampCard } from "@/components/catalog/StampCard";
import { DemoBadge } from "@/components/catalog/badges";
import { passportQuery } from "@/services/queries";
import { useCollection } from "@/stores/collection";
import { useT } from "@/i18n";

export const Route = createFileRoute("/passports/$passportId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(passportQuery(params.passportId));
    if (!data) throw notFound();
    return { name: data.passport.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — туристический паспорт` },
          { name: "description", content: `Печати, организатор и география: ${loaderData.name}.` },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: "Список печатей туристического паспорта." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Паспорт недоступен" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: PassportPage,
});

function PassportPage() {
  const t = useT();
  const { passportId } = Route.useParams();
  const { data } = useSuspenseQuery(passportQuery(passportId));
  const { ids } = useCollection();
  if (!data) return <NotFoundState />;
  const { passport, stamps, regions } = data;
  const collected = stamps.filter((s) => ids.has(s.stamp.id)).length;

  return (
    <Container className="pt-6">
      <Link to="/passports" className="text-sm text-muted-foreground hover:text-primary">← {t.passports.title}</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="mx-auto w-44 md:w-full">
          {passport.coverImage && (
            <img src={passport.coverImage.url} alt={passport.coverImage.alt} width={440} height={580} className="aspect-[3/4] w-full rounded-lg border border-border object-cover shadow-[var(--shadow-lift)]" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">{passport.isDemo && <DemoBadge />}</div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{passport.name}</h1>
          <p className="text-muted-foreground">{passport.description}</p>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="surface p-3">
              <dt className="eyebrow">{t.passports.geography}</dt>
              <dd className="mt-1 text-sm">
                {passport.geography}
                {regions.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {regions.map((r) => (
                      <Link key={r.id} to="/region/$regionId" params={{ regionId: r.id }} className="text-xs text-primary hover:underline">{r.name}</Link>
                    ))}
                  </div>
                )}
              </dd>
            </div>
            <div className="surface p-3">
              <dt className="eyebrow">{t.passports.organizer}</dt>
              <dd className="mt-1 text-sm">{passport.organizer}</dd>
            </div>
            <div className="surface p-3 sm:col-span-2">
              <dt className="eyebrow">{t.passports.officialSource}</dt>
              <dd className="mt-1 text-sm">
                {passport.officialUrl ? (
                  <a href={passport.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    {passport.officialUrl} <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">{t.passports.noOfficialSource}</span>
                )}
              </dd>
            </div>
          </dl>
          {stamps.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-sm font-medium">{t.passports.progress(collected, stamps.length)}</div>
              <ProgressBar value={collected} max={stamps.length} label={t.passports.progress(collected, stamps.length)} />
            </div>
          )}
        </div>
      </div>
      {passport.isDemo && <Notice className="mt-6">{t.app.demoNotice}</Notice>}
      <section className="mt-10">
        <SectionHeader title={t.passports.stampsTitle} hint={t.common.stamps(stamps.length)} />
        {stamps.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stamps.map((s) => <StampCard key={s.stamp.id} item={s} />)}
          </div>
        ) : (
          <EmptyState title={t.passports.noStamps} />
        )}
      </section>
    </Container>
  );
}
