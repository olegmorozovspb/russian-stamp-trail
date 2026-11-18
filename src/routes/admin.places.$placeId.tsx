import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { newId, useAdmin } from "@/components/admin/admin-store";
import { Field, FormSection, PhotoPicker } from "@/components/admin/form-bits";
import { NotFoundState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import type { DayHours, Place, PublicationStatus } from "@/types/domain";
import { formatDate, useT } from "@/i18n";

export const Route = createFileRoute("/admin/places/$placeId")({ component: PlaceEditPage });

const STATUSES: PublicationStatus[] = ["draft", "pending_review", "published", "needs_update", "temporarily_unavailable", "archived"];

function blankPlace(orgId: string, cityId: string): Place {
  const ts = new Date().toISOString();
  return {
    id: newId("p"),
    organizationId: orgId,
    cityId,
    name: "",
    address: "",
    location: { lat: 55.75, lng: 37.62 },
    photos: [],
    openingHours: { regular: [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day: d as DayHours["day"], open: "10:00", close: "18:00" })) },
    status: "draft",
    lastVerifiedAt: null,
    source: { type: "editorial", name: "Редакция" },
    isDemo: true,
    createdAt: ts,
    updatedAt: ts,
  };
}

function PlaceEditPage() {
  const t = useT();
  const f = t.admin.form;
  const { placeId } = Route.useParams();
  const { state, dispatch } = useAdmin();
  const navigate = useNavigate();
  const isNew = placeId === "new";
  const existing = state.places.find((p) => p.id === placeId);
  const [form, setForm] = useState<Place | null>(() =>
    isNew ? blankPlace(state.organizations[0]?.id ?? "", state.cities[0]?.id ?? "") : existing ? structuredClone(existing) : null,
  );
  const [error, setError] = useState(false);
  if (!form) return <NotFoundState />;
  const current = state.places.find((p) => p.id === form.id);
  const set = (patch: Partial<Place>) => setForm({ ...form, ...patch });
  const setDay = (day: number, patch: Partial<DayHours>) =>
    set({ openingHours: { ...form.openingHours, regular: form.openingHours.regular.map((d) => (d.day === day ? { ...d, ...patch } : d)) } });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError(true);
    dispatch({ type: "upsertPlace", place: { ...form, name: form.name.trim() } });
    toast(t.admin.saved);
    navigate({ to: "/admin/places" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">{isNew ? f.newPlace : f.editPlace}</h2>
        <Link to="/admin/places" className="text-sm text-muted-foreground hover:text-primary">← {t.admin.sections.places}</Link>
      </div>

      <FormSection title={t.admin.sections.places}>
        <Field label={f.placeName} required>
          <input className="field" value={form.name} onChange={(e) => { set({ name: e.target.value }); setError(false); }} aria-invalid={error} />
          {error && <span className="text-xs text-stamp">{f.required}</span>}
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={f.organization}>
            <select className="field" value={form.organizationId} onChange={(e) => set({ organizationId: e.target.value })}>
              {state.organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </Field>
          <Field label={f.city}>
            <select className="field" value={form.cityId} onChange={(e) => set({ cityId: e.target.value })}>
              {state.cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label={f.address}>
          <input className="field" value={form.address} onChange={(e) => set({ address: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={f.lat}>
            <input className="field" type="number" step="0.00001" value={form.location.lat} onChange={(e) => set({ location: { ...form.location, lat: Number(e.target.value) } })} />
          </Field>
          <Field label={f.lng}>
            <input className="field" type="number" step="0.00001" value={form.location.lng} onChange={(e) => set({ location: { ...form.location, lng: Number(e.target.value) } })} />
          </Field>
        </div>
        <Field label={t.admin.status}>
          <select className="field" value={form.status} onChange={(e) => set({ status: e.target.value as PublicationStatus })}>
            {STATUSES.map((s) => <option key={s} value={s}>{t.statuses[s]}</option>)}
          </select>
        </Field>
      </FormSection>

      <FormSection title={f.hours}>
        <div className="space-y-2">
          {form.openingHours.regular.map((d) => {
            const closed = !d.open;
            return (
              <div key={d.day} className="grid grid-cols-[2.5rem_1fr_1fr_auto] items-center gap-2 text-sm">
                <span className="font-medium">{t.weekdaysShort[d.day]}</span>
                <input aria-label={`${t.weekdays[d.day]}: открытие`} type="time" className="field" disabled={closed} value={d.open ?? ""} onChange={(e) => setDay(d.day, { open: e.target.value })} />
                <input aria-label={`${t.weekdays[d.day]}: закрытие`} type="time" className="field" disabled={closed} value={d.close ?? ""} onChange={(e) => setDay(d.day, { close: e.target.value })} />
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={closed} onChange={(e) => setDay(d.day, e.target.checked ? { open: null, close: null } : { open: "10:00", close: "18:00" })} />
                  {f.closedDay}
                </label>
              </div>
            );
          })}
        </div>
        <Field label={f.notice}>
          <textarea className="field" value={form.temporaryNotice ?? ""} onChange={(e) => set({ temporaryNotice: e.target.value || undefined })} />
        </Field>
      </FormSection>

      <FormSection title={f.photos}>
        <PhotoPicker photos={form.photos} onChange={(photos) => set({ photos })} />
      </FormSection>

      {!isNew && current && (
        <FormSection title={f.lastVerified}>
          <p className="text-sm">{current.lastVerifiedAt ? formatDate(current.lastVerifiedAt) : t.common.notVerified}</p>
          <Button
            type="button"
            variant="paper"
            onClick={() => {
              const checkedAt = new Date().toISOString();
              dispatch({ type: "addVerification", log: { id: newId("v"), targetType: "place", targetId: form.id, checkedAt, checkedBy: "Редактор (демо)", result: "confirmed" } });
              set({ lastVerifiedAt: checkedAt });
              toast(f.verifiedToast);
            }}
          >
            <CalendarCheck />
            {f.markVerified}
          </Button>
        </FormSection>
      )}

      <div className="flex gap-2">
        <Button type="submit">{t.common.save}</Button>
        <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/places" })}>{t.common.cancel}</Button>
      </div>
    </form>
  );
}
