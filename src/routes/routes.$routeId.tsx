import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Container, Notice } from "@/components/common/page";
import { ErrorState, LoadingState, NotFoundState } from "@/components/common/states";
import { DemoBadge } from "@/components/catalog/badges";
import { RouteStopsList, RouteSummaryPanel } from "@/components/catalog/RouteStopsList";
import { RouteMap } from "@/components/map/RouteMap";
import type { StampMapHandle } from "@/components/map/StampMap";
import { Button } from "@/components/ui/button";
import { routeQuery } from "@/services/queries";
import { routeActions } from "@/stores/route-builder";
import { useT } from "@/i18n";

export const Route = createFileRoute("/routes/$routeId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(routeQuery(params.routeId));
    if (!data) throw notFound();
    return { title: data.route.title };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — маршрут за печатями` },
          { name: "description", content: `Точки маршрута: ${loaderData.title}. Откройте в навигаторе или скопируйте в свой маршрут.` },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: "Маршрут по местам получения туристических печатей." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Маршрут недоступен" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: RouteDetailPage,
});

function RouteDetailPage() {
  const t = useT();
  const { routeId } = Route.useParams();
  const { data } = useSuspenseQuery(routeQuery(routeId));
  const navigate = useNavigate();
  const mapRef = useRef<StampMapHandle>(null);
  if (!data) return <NotFoundState />;
  const { route, stops } = data;

  return (
    <Container className="pt-6">
      <Link to="/routes" className="text-sm text-muted-foreground hover:text-primary">← {t.routes.title}</Link>
      <header className="mt-3 space-y-2 pb-6">
        {route.isDemo && <DemoBadge />}
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{route.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{route.description}</p>
        <Button
          onClick={() => {
            routeActions.addMany(stops.map((s) => s.place.id));
            toast(t.routes.copiedToast);
            navigate({ to: "/routes" });
          }}
        >
          <Copy />
          {t.routes.copyToMine}
        </Button>
      </header>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <RouteStopsList stops={stops} onFocus={(p) => mapRef.current?.focus(p.place.location.lat, p.place.location.lng, 15)} />
          <div className="surface p-4">
            <RouteSummaryPanel stops={stops} />
          </div>
        </div>
        <div className="space-y-2">
          <RouteMap stops={stops} mapRef={mapRef} />
          {route.isDemo && <Notice>{t.app.demoNotice}</Notice>}
        </div>
      </div>
    </Container>
  );
}
