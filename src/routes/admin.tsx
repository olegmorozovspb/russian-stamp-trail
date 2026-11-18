import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { Container } from "@/components/common/page";
import { ErrorState, LoadingState } from "@/components/common/states";
import { AdminProvider } from "@/components/admin/admin-store";
import { adminSnapshotQuery } from "@/services/queries";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Административная панель (демо) — Карта туристических печатей" },
      { name: "description", content: "Демонстрационный интерфейс управления каталогом печатей." },
      { property: "og:title", content: "Административная панель (демо)" },
      { property: "og:description", content: "Демонстрационный интерфейс управления каталогом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminSnapshotQuery),
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  component: AdminLayout,
});

const sections = [
  { to: "/admin", key: "dashboard", exact: true },
  { to: "/admin/places", key: "places" },
  { to: "/admin/stamps", key: "stamps" },
  { to: "/admin/passports", key: "passports" },
  { to: "/admin/organizations", key: "organizations" },
  { to: "/admin/cities", key: "cities" },
  { to: "/admin/regions", key: "regions" },
  { to: "/admin/submissions", key: "submissions" },
  { to: "/admin/verification", key: "verification" },
] as const;

function AdminLayout() {
  const t = useT();
  const { data } = useSuspenseQuery(adminSnapshotQuery);
  return (
    <AdminProvider initial={data}>
      <Container className="pt-6">
        <div className="mb-4 flex gap-3 rounded-lg border-2 border-dashed border-amber/50 bg-amber-soft p-3 text-sm">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber" />
          <div className="space-y-1">
            <p className="font-semibold">{t.admin.demoBanner}</p>
            <p className="text-muted-foreground">{t.admin.futureNote}</p>
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-extrabold">{t.admin.title}</h1>
        <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
          <nav aria-label={t.admin.title} className="-mx-4 overflow-x-auto px-4 scrollbar-none lg:mx-0 lg:px-0">
            <ul className="flex gap-1 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:flex-col">
              {sections.map((s) => (
                <li key={s.key}>
                  <Link
                    to={s.to}
                    activeOptions={{ exact: "exact" in s }}
                    className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-accent-foreground"
                  >
                    {t.admin.sections[s.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </Container>
    </AdminProvider>
  );
}
