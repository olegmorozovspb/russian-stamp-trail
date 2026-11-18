import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAdmin } from "@/components/admin/admin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubmissionStatus } from "@/types/domain";
import { formatDate, useT } from "@/i18n";

export const Route = createFileRoute("/admin/submissions")({ component: Page });

function Page() {
  const t = useT();
  const { state, dispatch } = useAdmin();
  const set = (id: string, status: SubmissionStatus) => {
    dispatch({ type: "setSubmissionStatus", id, status });
    toast(t.admin.submissions.statuses[status]);
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t.admin.futureNote}</p>
      {state.submissions.map((s) => (
        <article key={s.id} className="surface space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="muted">{t.admin.submissions.kinds[s.kind]}</Badge>
            <Badge variant={s.status === "accepted" ? "moss" : s.status === "rejected" ? "stamp" : "ink"}>{t.admin.submissions.statuses[s.status]}</Badge>
            <span className="text-xs text-muted-foreground">
              {t.admin.submissions.roles[s.submitterRole]} · {s.submittedBy} · {formatDate(s.createdAt)}
            </span>
          </div>
          <p className="text-sm">{s.summary}</p>
          {(s.status === "new" || s.status === "in_review") && (
            <div className="flex flex-wrap gap-2">
              {s.status === "new" && <Button size="sm" variant="paper" onClick={() => set(s.id, "in_review")}>{t.admin.submissions.take}</Button>}
              <Button size="sm" onClick={() => set(s.id, "accepted")}>{t.admin.submissions.accept}</Button>
              <Button size="sm" variant="ghost" className="text-stamp hover:text-stamp" onClick={() => set(s.id, "rejected")}>{t.admin.submissions.reject}</Button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
