import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Container, DemoNotice, PageHeader } from "@/components/common/page";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { PassportCard } from "@/components/catalog/cards";
import { passportsQuery, catalogQuery } from "@/services/queries";
import { useCollection } from "@/stores/collection";
import { useT } from "@/i18n";

export const Route = createFileRoute("/passports/")({
  head: () => ({
    meta: [
      { title: "Туристические паспорта — Карта туристических печатей России" },
      { name: "description", content: "Туристические паспорта и проекты, объединяющие печати из разных городов и организаций." },
      { property: "og:title", content: "Туристические паспорта" },
      { property: "og:description", content: "Проекты, объединяющие печати из разных городов." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(passportsQuery), context.queryClient.ensureQueryData(catalogQuery)]),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: PassportsPage,
});

function PassportsPage() {
  const t = useT();
  const { data } = useSuspenseQuery(passportsQuery);
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { ids } = useCollection();
  const collectedFor = (passportId: string) =>
    catalog.items.filter((i) => i.passportIds.includes(passportId) && ids.has(i.stamp.id)).length;

  return (
    <Container>
      <PageHeader title={t.passports.title} lead={t.passports.lead} />
      {data.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((p) => <PassportCard key={p.passport.id} summary={p} collected={collectedFor(p.passport.id)} />)}
        </div>
      ) : (
        <EmptyState title={t.passports.empty} />
      )}
      <DemoNotice className="mt-8" />
    </Container>
  );
}
