import type { LatLng } from "@/types/domain";

export interface DraftStop {
  id: string;
  placeId: string;
}

export function addStop(stops: DraftStop[], placeId: string): DraftStop[] {
  if (stops.some((s) => s.placeId === placeId)) return stops;
  return [...stops, { id: `stop-${placeId}`, placeId }];
}

export function removeStop(stops: DraftStop[], placeId: string): DraftStop[] {
  return stops.filter((s) => s.placeId !== placeId);
}

/** Move a stop one position up (-1) or down (+1). Out-of-range moves are ignored. */
export function moveStop(stops: DraftStop[], index: number, dir: -1 | 1): DraftStop[] {
  const target = index + dir;
  if (index < 0 || index >= stops.length || target < 0 || target >= stops.length) return stops;
  const next = [...stops];
  const a = next[index]!;
  next[index] = next[target]!;
  next[target] = a;
  return next;
}

/** Great-circle distance in km. This is a STRAIGHT LINE, not a road or walking distance. */
export function straightLineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function totalStraightLineKm(points: LatLng[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) sum += straightLineKm(points[i - 1]!, points[i]!);
  return sum;
}

const coord = (p: LatLng) => `${p.lat},${p.lng}`;

export function yandexRouteUrl(points: LatLng[]): string {
  return `https://yandex.ru/maps/?rtext=${points.map(coord).join("~")}&rtt=pd`;
}

export function googleRouteUrl(points: LatLng[]): string {
  return `https://www.google.com/maps/dir/${points.map(coord).join("/")}`;
}

export function osmPointUrl(p: LatLng, zoom = 17): string {
  return `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=${zoom}/${p.lat}/${p.lng}`;
}
