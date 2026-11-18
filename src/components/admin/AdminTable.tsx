import { useMemo, useState, type ReactNode } from "react";
import { SearchField } from "@/components/common/controls";
import { useT } from "@/i18n";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  searchText,
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  toolbar?: ReactNode;
}) {
  const t = useT();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => rows.filter((r) => !q || searchText(r).toLocaleLowerCase("ru").includes(q.toLocaleLowerCase("ru"))),
    [rows, q, searchText],
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SearchField label={t.common.search} value={q} onChange={setQ} placeholder={t.admin.searchPlaceholder} className="w-full max-w-xs" />
        {toolbar}
      </div>
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground">{t.admin.noItems}</td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                {columns.map((c) => (
                  <td key={c.key} className={`px-3 py-2 align-middle ${c.className ?? ""}`}>{c.cell(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
