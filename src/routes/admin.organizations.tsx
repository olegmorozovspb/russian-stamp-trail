import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/organizations")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  return (
    <AdminTable
      rows={state.organizations}
      searchText={(o) => o.name}
      columns={[
        { key: "name", header: t.admin.name, cell: (o) => <span className="font-medium">{o.name}</span> },
        { key: "type", header: t.common.category, cell: (o) => t.orgTypes[o.type] },
        { key: "places", header: t.admin.sections.places, cell: (o) => state.places.filter((p) => p.organizationId === o.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (o) => <AdminStatusBadge status={o.status} /> },
      ]}
    />
  );
}
