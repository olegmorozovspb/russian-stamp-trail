import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { PublishToggle } from "@/components/admin/StatusToggle";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { Button } from "@/components/ui/button";
import { formatDate, useT } from "@/i18n";

export const Route = createFileRoute("/admin/places/")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  const cityName = (id: string) => state.cities.find((c) => c.id === id)?.name ?? "—";
  return (
    <AdminTable
      rows={state.places}
      searchText={(p) => `${p.name} ${cityName(p.cityId)}`}
      toolbar={
        <Button asChild size="sm">
          <Link to="/admin/places/$placeId" params={{ placeId: "new" }}><Plus />{t.admin.addPlace}</Link>
        </Button>
      }
      columns={[
        { key: "name", header: t.admin.name, cell: (p) => <Link to="/admin/places/$placeId" params={{ placeId: p.id }} className="font-medium hover:text-primary">{p.name}</Link> },
        { key: "city", header: t.common.city, cell: (p) => cityName(p.cityId) },
        { key: "stamps", header: t.admin.sections.stamps, cell: (p) => state.stamps.filter((s) => s.placeId === p.id).length, className: "text-right" },
        { key: "status", header: t.admin.status, cell: (p) => <AdminStatusBadge status={p.status} /> },
        { key: "verified", header: t.admin.form.lastVerified, cell: (p) => <span className="text-xs text-muted-foreground">{p.lastVerifiedAt ? formatDate(p.lastVerifiedAt) : "—"}</span> },
        {
          key: "actions",
          header: t.admin.actions,
          cell: (p) => (
            <div className="flex gap-1">
              <Button asChild size="icon" variant="ghost" aria-label={t.common.edit}>
                <Link to="/admin/places/$placeId" params={{ placeId: p.id }}><Pencil /></Link>
              </Button>
              <PublishToggle entity="places" id={p.id} status={p.status} />
            </div>
          ),
        },
      ]}
    />
  );
}
