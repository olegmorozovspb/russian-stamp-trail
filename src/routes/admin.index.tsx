import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useAdmin } from "@/components/admin/admin-store";
import { AdminStatusBadge } from "@/components/catalog/badges";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublicationStatus } from "@/types/domain";
import { formatDate, useT } from "@/i18n";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATUSES: PublicationStatus[] = ["draft", "pending_review", "published", "needs_update", "temporarily_unavailable", "archived"];

function AdminDashboard() {
  const t = useT();
  const { state } = useAdmin();
  const count = (list: { status: PublicationStatus }[], s: PublicationStatus) => list.filter((x) => x.status === s).length;
  const attention = [
    ...state.places.filter((p) => p.status === "needs_update" || p.status === "pending_review").map((p) => ({ id: p.id, name: p.name, status: p.status, kind: "place" as const })),
    ...state.stamps.filter((s) => s.status === "needs_update" || s.status === "pending_review").map((s) => ({ id: s.id, name: s.name ?? s.description, status: s.status, kind: "stamp" as const })),
  ];
  const newSubs = state.submissions.filter((s) => s.status === "new" || s.status === "in_review");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild><Link to="/admin/places/$placeId" params={{ placeId: "new" }}><Plus />{t.admin.addPlace}</Link></Button>
        <Button asChild variant="paper"><Link to="/admin/stamps/$stampId" params={{ stampId: "new" }}><Plus />{t.admin.addStamp}</Link></Button>
      </div>

      <section className="surface overflow-x-auto p-4">
        <h2 className="mb-3 text-xl font-bold">{t.admin.byStatus}</h2>
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-1">{t.admin.status}</th>
              <th className="py-1 text-right">{t.admin.sections.places}</th>
              <th className="py-1 text-right">{t.admin.sections.stamps}</th>
              <th className="py-1 text-right">{t.admin.sections.passports}</th>
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((s) => (
              <tr key={s} className="border-t border-border">
                <td className="py-2"><AdminStatusBadge status={s} /></td>
                <td className="py-2 text-right tabular-nums">{count(state.places, s)}</td>
                <td className="py-2 text-right tabular-nums">{count(state.stamps, s)}</td>
                <td className="py-2 text-right tabular-nums">{count(state.passports, s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="surface p-4">
          <h2 className="mb-3 text-xl font-bold">{t.admin.needsAttention}</h2>
          {attention.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.admin.noItems}</p>
          ) : (
            <ul className="space-y-2">
              {attention.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                  {a.kind === "place" ? (
                    <Link to="/admin/places/$placeId" params={{ placeId: a.id }} className="truncate hover:text-primary">{a.name}</Link>
                  ) : (
                    <Link to="/admin/stamps/$stampId" params={{ stampId: a.id }} className="truncate hover:text-primary">{a.name}</Link>
                  )}
                  <AdminStatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="surface p-4">
          <h2 className="mb-3 text-xl font-bold">{t.admin.recentSubmissions}</h2>
          {newSubs.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.admin.noItems}</p>
          ) : (
            <ul className="space-y-2">
              {newSubs.map((s) => (
                <li key={s.id} className="text-sm">
                  <Link to="/admin/submissions" className="hover:text-primary">{s.summary}</Link>
                  <div className="mt-0.5 flex gap-1.5">
                    <Badge variant="muted">{t.admin.submissions.kinds[s.kind]}</Badge>
                    <Badge variant="ink">{t.admin.submissions.statuses[s.status]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="surface p-4">
        <h2 className="mb-3 text-xl font-bold">{t.admin.recentChecks}</h2>
        <ul className="space-y-1.5 text-sm">
          {state.verificationLogs.slice(0, 5).map((v) => (
            <li key={v.id} className="flex flex-wrap justify-between gap-2">
              <span>{v.targetId} · {t.admin.verification.results[v.result]}</span>
              <span className="text-muted-foreground">{formatDate(v.checkedAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
