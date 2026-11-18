import { useEffect, useState, type ReactNode } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/types/domain";
import { useT } from "@/i18n";

export function Field({ label, children, hint, required }: { label: string; children: ReactNode; hint?: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-stamp"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="surface space-y-3 p-4">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </fieldset>
  );
}

/** Local-only photo picker: previews via object URLs, nothing is uploaded. */
export function PhotoPicker({ photos, onChange }: { photos: Photo[]; onChange: (p: Photo[]) => void }) {
  const t = useT();
  const [created, setCreated] = useState<string[]>([]);
  useEffect(() => () => created.forEach((u) => URL.revokeObjectURL(u)), [created]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {photos.map((p) => (
          <div key={p.id} className="relative">
            <img src={p.url} alt={p.alt} className="size-20 rounded-md border border-border object-cover" />
            <button
              type="button"
              aria-label={t.common.delete}
              onClick={() => onChange(photos.filter((x) => x.id !== p.id))}
              className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-card text-stamp shadow"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <Button asChild variant="paper" className="size-20 flex-col gap-1 text-xs">
          <label>
            <ImagePlus />
            {t.admin.form.upload}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                const files = [...(e.target.files ?? [])];
                const added = files.map((f) => {
                  const url = URL.createObjectURL(f);
                  return { id: `local-${f.name}-${f.size}`, url, alt: f.name };
                });
                setCreated((c) => [...c, ...added.map((a) => a.url)]);
                onChange([...photos, ...added]);
                e.target.value = "";
              }}
            />
          </label>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t.admin.form.photosNote}</p>
    </div>
  );
}
