import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { PublishToggle } from "@/components/admin/StatusToggle";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/passports")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  return (
    <AdminTable
      rows={state.passports}
      searchText={(p) => p.name}
      columns={[
        { key: "name", header: t.admin.name, cell: (p) => <span className="font-medium">{p.name}</span> },
        { key: "org", header: t.passports.organizer, cell: (p) => p.organizer },
        { key: "stamps", header: t.admin.sections.stamps, cell: (p) => state.passportStamps.filter((l) => l.passportId === p.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (p) => <AdminStatusBadge status={p.status} /> },
        { key: "actions", header: t.admin.actions, cell: (p) => <PublishToggle entity="passports" id={p.id} status={p.status} /> },
      ]}
    />
  );
}
