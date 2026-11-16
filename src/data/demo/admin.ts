/** DEMO DATA — example moderation queue and verification history. */
import type { Submission, VerificationLog } from "@/types/domain";

export const demoSubmissions: Submission[] = [
  { id: "sub-1", kind: "new_place", targetType: null, targetId: null, summary: "Предложение новой точки: кафе с печатью в Иркутске (демо).", submittedBy: "Партнёр (демо)", submitterRole: "partner", status: "new", isDemo: true, createdAt: "2026-11-05T09:00:00Z", updatedAt: "2026-11-05T09:00:00Z" },
  { id: "sub-2", kind: "update", targetType: "place", targetId: "p-rostov-kraeved", summary: "Изменились часы работы музея (демо).", submittedBy: "Посетитель (демо)", submitterRole: "visitor", status: "in_review", isDemo: true, createdAt: "2026-11-02T14:30:00Z", updatedAt: "2026-11-03T10:00:00Z" },
  { id: "sub-3", kind: "report_issue", targetType: "stamp", targetId: "s-ekb-puppets", summary: "Печать не выдают, театр закрыт (демо).", submittedBy: "Посетитель (демо)", submitterRole: "visitor", status: "accepted", isDemo: true, createdAt: "2026-07-28T12:00:00Z", updatedAt: "2026-07-30T12:00:00Z" },
  { id: "sub-4", kind: "update", targetType: "stamp", targetId: "s-spb-pereplet", summary: "Новая стоимость печати (демо).", submittedBy: "Партнёр (демо)", submitterRole: "partner", status: "rejected", isDemo: true, createdAt: "2026-10-20T08:00:00Z", updatedAt: "2026-10-21T08:00:00Z" },
];

export const demoVerificationLogs: VerificationLog[] = [
  { id: "v-1", targetType: "place", targetId: "p-moscow-strannik", checkedAt: "2026-10-12T12:00:00Z", checkedBy: "Редактор (демо)", result: "confirmed" },
  { id: "v-2", targetType: "place", targetId: "p-suzdal-tic", checkedAt: "2026-10-09T12:00:00Z", checkedBy: "Редактор (демо)", result: "confirmed" },
  { id: "v-3", targetType: "stamp", targetId: "s-ekb-puppets", checkedAt: "2026-07-30T12:00:00Z", checkedBy: "Редактор (демо)", result: "unavailable", note: "Ремонт, печать временно не выдаётся." },
  { id: "v-4", targetType: "place", targetId: "p-irkutsk-tea", checkedAt: "2026-10-11T12:00:00Z", checkedBy: "Редактор (демо)", result: "changed", note: "Обновлены часы работы." },
  { id: "v-5", targetType: "passport", targetId: "pp-golden", checkedAt: "2026-09-20T12:00:00Z", checkedBy: "Редактор (демо)", result: "confirmed" },
];
