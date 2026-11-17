import type { OpeningHours } from "@/types/domain";
import { useT } from "@/i18n";

export function OpeningHoursTable({ hours }: { hours: OpeningHours }) {
  const t = useT();
  if (!hours.regular.length) return <p className="text-sm text-muted-foreground">{t.place.noHours}</p>;
  return (
    <div className="space-y-2">
      <table className="w-full text-sm">
        <caption className="sr-only">{t.place.hours}</caption>
        <tbody>
          {hours.regular.map((d) => (
            <tr key={d.day} className="border-b border-dashed border-border last:border-0">
              <th scope="row" className="py-1.5 text-left font-medium text-muted-foreground">{t.weekdays[d.day]}</th>
              <td className="py-1.5 text-right tabular-nums">
                {d.open && d.close ? `${d.open}–${d.close}` : <span className="text-stamp">{t.place.closed}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hours.note && <p className="text-xs text-muted-foreground">{hours.note}</p>}
    </div>
  );
}
