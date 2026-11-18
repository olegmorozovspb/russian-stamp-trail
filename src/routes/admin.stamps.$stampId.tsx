import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { newId, useAdmin } from "@/components/admin/admin-store";
import { Field, FormSection, PhotoPicker } from "@/components/admin/form-bits";
import { NotFoundState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import type { PublicationStatus, Stamp, StampAvailability, StampConditionType } from "@/types/domain";
import { useT } from "@/i18n";

export const Route = createFileRoute("/admin/stamps/$stampId")({ component: StampEditPage });

const STATUSES: PublicationStatus[] = ["draft", "pending_review", "published", "needs_update", "temporarily_unavailable", "archived"];
const COND_TYPES: StampConditionType[] = ["free", "purchase", "ticket", "ask_staff", "own_passport", "other"];
const AVAIL: StampAvailability[] = ["available", "temporarily_unavailable", "unknown"];

function blankStamp(placeId: string): Stamp {
  const ts = new Date().toISOString();
  return {
    id: newId("s"),
    placeId,
    name: null,
    description: "",
    photos: [],
    conditions: [],
    price: { kind: "unknown" },
    availability: "unknown",
    status: "draft",
    lastVerifiedAt: null,
    source: { type: "editorial", name: "Редакция" },
    isDemo: true,
    createdAt: ts,
    updatedAt: ts,
  };
}

function StampEditPage() {
  const t = useT();
  const f = t.admin.form;
  const { stampId } = Route.useParams();
  const { state, dispatch } = useAdmin();
  const navigate = useNavigate();
  const isNew = stampId === "new";
  const existing = state.stamps.find((s) => s.id === stampId);
  const [form, setForm] = useState<Stamp | null>(() => (isNew ? blankStamp(state.places[0]?.id ?? "") : existing ? structuredClone(existing) : null));
  const [passportIds, setPassportIds] = useState<string[]>(() => state.passportStamps.filter((l) => l.stampId === stampId).map((l) => l.passportId));
  const [error, setError] = useState(false);
  if (!form) return <NotFoundState />;
  const set = (patch: Partial<Stamp>) => setForm({ ...form, ...patch });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return setError(true);
    dispatch({
      type: "upsertStamp",
      stamp: { ...form, name: form.name?.trim() || null, conditions: form.conditions.filter((c) => c.text.trim()) },
      passportIds,
    });
    toast(t.admin.saved);
    navigate({ to: "/admin/stamps" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">{isNew ? f.newStamp : f.editStamp}</h2>
        <Link to="/admin/stamps" className="text-sm text-muted-foreground hover:text-primary">← {t.admin.sections.stamps}</Link>
      </div>

      <FormSection title={t.admin.sections.stamps}>
        <Field label={f.place}>
          <select className="field" value={form.placeId} onChange={(e) => set({ placeId: e.target.value })}>
            {state.places.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {state.cities.find((c) => c.id === p.cityId)?.name}</option>
            ))}
          </select>
        </Field>
        <Field label={f.stampName}>
          <input className="field" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label={f.description} required>
          <textarea className="field" value={form.description} onChange={(e) => { set({ description: e.target.value }); setError(false); }} aria-invalid={error} />
          {error && <span className="text-xs text-stamp">{f.required}</span>}
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={f.availability}>
            <select className="field" value={form.availability} onChange={(e) => set({ availability: e.target.value as StampAvailability })}>
              {AVAIL.map((a) => <option key={a} value={a}>{t.availability[a]}</option>)}
            </select>
          </Field>
          <Field label={t.admin.status}>
            <select className="field" value={form.status} onChange={(e) => set({ status: e.target.value as PublicationStatus })}>
              {STATUSES.map((s) => <option key={s} value={s}>{t.statuses[s]}</option>)}
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection title={f.conditions}>
        {form.conditions.map((c, i) => (
          <div key={c.id} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] gap-2">
            <select
              aria-label={t.common.category}
              className="field"
              value={c.type}
              onChange={(e) => set({ conditions: form.conditions.map((x, j) => (j === i ? { ...x, type: e.target.value as StampConditionType } : x)) })}
            >
              {COND_TYPES.map((ct) => <option key={ct} value={ct}>{t.conditionTypes[ct]}</option>)}
            </select>
            <input
              aria-label={f.conditionText}
              placeholder={f.conditionText}
              className="field"
              value={c.text}
              onChange={(e) => set({ conditions: form.conditions.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
            />
            <Button type="button" variant="ghost" size="icon" aria-label={t.common.delete} onClick={() => set({ conditions: form.conditions.filter((_, j) => j !== i) })}>
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button type="button" variant="paper" size="sm" onClick={() => set({ conditions: [...form.conditions, { id: newId("c"), type: "free", text: "" }] })}>
          <Plus />
          {f.addCondition}
        </Button>
      </FormSection>

      <FormSection title={f.price}>
        <div className="flex flex-wrap gap-4 text-sm">
          {(["free", "paid", "unknown"] as const).map((k) => (
            <label key={k} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="price"
                checked={form.price.kind === k}
                onChange={() => set({ price: k === "paid" ? { kind: "paid", amount: 50, currency: "RUB" } : { kind: k } })}
              />
              {k === "free" ? f.priceFree : k === "paid" ? f.pricePaid : f.priceUnknown}
            </label>
          ))}
        </div>
        {form.price.kind === "paid" && (
          <Field label={f.amount}>
            <input
              className="field max-w-40"
              type="number"
              min={0}
              value={form.price.amount}
              onChange={(e) => set({ price: { kind: "paid", amount: Number(e.target.value), currency: "RUB" } })}
            />
          </Field>
        )}
      </FormSection>

      <FormSection title={f.passports}>
        <div className="grid gap-2 sm:grid-cols-2">
          {state.passports.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={passportIds.includes(p.id)}
                onChange={(e) => setPassportIds(e.target.checked ? [...passportIds, p.id] : passportIds.filter((x) => x !== p.id))}
              />
              {p.name}
            </label>
          ))}
        </div>
      </FormSection>

      <FormSection title={f.photos}>
        <PhotoPicker photos={form.photos} onChange={(photos) => set({ photos })} />
      </FormSection>

      <div className="flex gap-2">
        <Button type="submit">{t.common.save}</Button>
        <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/stamps" })}>{t.common.cancel}</Button>
      </div>
    </form>
  );
}
