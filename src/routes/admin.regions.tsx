import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/regions")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  return (
    <AdminTable
      rows={state.regions}
      searchText={(r) => r.name}
      columns={[
        { key: "name", header: t.admin.name, cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "cities", header: t.admin.sections.cities, cell: (r) => state.cities.filter((c) => c.regionId === r.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (r) => <AdminStatusBadge status={r.status} /> },
      ]}
    />
  );
}
