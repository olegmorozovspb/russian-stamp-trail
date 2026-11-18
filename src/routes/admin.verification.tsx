import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdmin } from "@/components/admin/admin-store";
import { Badge } from "@/components/ui/badge";
import { formatDate, useT } from "@/i18n";

export const Route = createFileRoute("/admin/verification")({ component: Page });

function Page() {
  const t = useT();
  const { state } = useAdmin();
  const targetName = (type: string, id: string) =>
    (type === "place" ? state.places.find((p) => p.id === id)?.name : type === "stamp" ? (state.stamps.find((s) => s.id === id)?.name ?? id) : state.passports.find((p) => p.id === id)?.name) ?? id;
  return (
    <AdminTable
      rows={state.verificationLogs}
      searchText={(v) => `${targetName(v.targetType, v.targetId)} ${v.checkedBy} ${v.note ?? ""}`}
      columns={[
        { key: "date", header: t.admin.verification.date, cell: (v) => <span className="whitespace-nowrap">{formatDate(v.checkedAt)}</span> },
        { key: "target", header: t.admin.verification.target, cell: (v) => <span className="font-medium">{targetName(v.targetType, v.targetId)}</span> },
        { key: "result", header: t.admin.verification.result, cell: (v) => <Badge variant={v.result === "confirmed" ? "moss" : v.result === "changed" ? "amber" : "stamp"}>{t.admin.verification.results[v.result]}</Badge> },
        { key: "by", header: t.admin.verification.checkedBy, cell: (v) => <span className="text-xs">{v.checkedBy}{v.note ? ` — ${v.note}` : ""}</span> },
      ]}
    />
  );
}
