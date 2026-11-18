import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/cities")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  const regionName = (id: string) => state.regions.find((r) => r.id === id)?.name ?? "—";
  return (
    <AdminTable
      rows={state.cities}
      searchText={(c) => `${c.name} ${regionName(c.regionId)}`}
      columns={[
        { key: "name", header: t.admin.name, cell: (c) => <span className="font-medium">{c.name}</span> },
        { key: "region", header: t.common.region, cell: (c) => regionName(c.regionId) },
        { key: "places", header: t.admin.sections.places, cell: (c) => state.places.filter((p) => p.cityId === c.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (c) => <AdminStatusBadge status={c.status} /> },
      ]}
    />
  );
}
