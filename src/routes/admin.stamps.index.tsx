import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { PublishToggle } from "@/components/admin/StatusToggle";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/stamps/")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  const placeName = (id: string) => state.places.find((p) => p.id === id)?.name ?? "—";
  return (
    <AdminTable
      rows={state.stamps}
      searchText={(s) => `${s.name ?? ""} ${placeName(s.placeId)} ${s.description}`}
      toolbar={
        <Button asChild size="sm">
          <Link to="/admin/stamps/$stampId" params={{ stampId: "new" }}><Plus />{t.admin.addStamp}</Link>
        </Button>
      }
      columns={[
        {
          key: "place",
          header: t.admin.form.place,
          cell: (s) => (
            <Link to="/admin/stamps/$stampId" params={{ stampId: s.id }} className="hover:text-primary">
              <div className="font-medium">{placeName(s.placeId)}</div>
              <div className="text-xs text-muted-foreground">{s.name ? `«${s.name}»` : t.catalog.unnamedStamp}</div>
            </Link>
          ),
        },
        { key: "passports", header: t.admin.sections.passports, cell: (s) => state.passportStamps.filter((l) => l.stampId === s.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (s) => <AdminStatusBadge status={s.status} /> },
        {
          key: "actions",
          header: t.admin.actions,
          cell: (s) => (
            <div className="flex gap-1">
              <Button asChild size="icon" variant="ghost" aria-label={t.common.edit}>
                <Link to="/admin/stamps/$stampId" params={{ stampId: s.id }}><Pencil /></Link>
              </Button>
              <PublishToggle entity="stamps" id={s.id} status={s.status} />
            </div>
          ),
        },
      ]}
    />
  );
}
