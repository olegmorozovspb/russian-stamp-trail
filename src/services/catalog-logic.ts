/**
 * Pure catalog logic: joins, filters, sorting and computed counts.
 * No I/O here — easy to unit-test and independent from the data provider.
 */
import {
  PUBLIC_STATUSES,
  type City,
  type Organization,
  type OrganizationType,
  type Passport,
  type PassportStamp,
  type Place,
  type Region,
  type Route,
  type Stamp,
} from "@/types/domain";

export interface CatalogSnapshot {
  regions: Region[];
  cities: City[];
  organizations: Organization[];
  places: Place[];
  stamps: Stamp[];
  passports: Passport[];
  passportStamps: PassportStamp[];
  routes: Route[];
}

/** Stamp joined with everything a card needs */
export interface StampItem {
  stamp: Stamp;
  place: Place;
  organization: Organization;
  city: City;
  region: Region;
  passportIds: string[];
}

/** Place joined with its public stamps (map marker / route stop) */
export interface PlaceItem {
  place: Place;
  organization: Organization;
  city: City;
  region: Region;
  stamps: Stamp[];
  passportIds: string[];
}

export const isPublic = (s: { status: Stamp["status"] }) => PUBLIC_STATUSES.includes(s.status);

export function buildStampItems(snap: CatalogSnapshot): StampItem[] {
  const placeById = new Map(snap.places.map((p) => [p.id, p]));
  const orgById = new Map(snap.organizations.map((o) => [o.id, o]));
  const cityById = new Map(snap.cities.map((c) => [c.id, c]));
  const regionById = new Map(snap.regions.map((r) => [r.id, r]));
  const passportIdsByStamp = new Map<string, string[]>();
  const publicPassportIds = new Set(snap.passports.filter(isPublic).map((p) => p.id));
  for (const link of snap.passportStamps) {
    if (!publicPassportIds.has(link.passportId)) continue;
    const list = passportIdsByStamp.get(link.stampId) ?? [];
    list.push(link.passportId);
    passportIdsByStamp.set(link.stampId, list);
  }
  const items: StampItem[] = [];
  for (const stamp of snap.stamps) {
    if (!isPublic(stamp)) continue;
    const place = placeById.get(stamp.placeId);
    if (!place || !isPublic(place)) continue;
    const organization = orgById.get(place.organizationId);
    const city = cityById.get(place.cityId);
    const region = city ? regionById.get(city.regionId) : undefined;
    if (!organization || !city || !region) continue;
    items.push({ stamp, place, organization, city, region, passportIds: passportIdsByStamp.get(stamp.id) ?? [] });
  }
  return items;
}

export function buildPlaceItems(stampItems: StampItem[], snap: CatalogSnapshot): PlaceItem[] {
  const byPlace = new Map<string, PlaceItem>();
  for (const it of stampItems) {
    const existing = byPlace.get(it.place.id);
    if (existing) {
      existing.stamps.push(it.stamp);
      for (const pid of it.passportIds) if (!existing.passportIds.includes(pid)) existing.passportIds.push(pid);
    } else {
      byPlace.set(it.place.id, {
        place: it.place,
        organization: it.organization,
        city: it.city,
        region: it.region,
        stamps: [it.stamp],
        passportIds: [...it.passportIds],
      });
    }
  }
  // Public places without public stamps are still places (e.g. stamp under review)
  void snap;
  return [...byPlace.values()];
}

export type CatalogSort = "name" | "date";

export interface StampFilters {
  query?: string;
  regionId?: string;
  cityId?: string;
  category?: OrganizationType | "";
  sort?: CatalogSort;
}

const norm = (s: string) => s.toLocaleLowerCase("ru").replace(/ё/g, "е").trim();

export function filterStampItems(items: StampItem[], f: StampFilters): StampItem[] {
  const q = f.query ? norm(f.query) : "";
  const result = items.filter((it) => {
    if (f.regionId && it.region.id !== f.regionId) return false;
    if (f.cityId && it.city.id !== f.cityId) return false;
    if (f.category && it.organization.type !== f.category) return false;
    if (q) {
      const hay = norm(
        [it.place.name, it.stamp.name ?? "", it.city.name, it.region.name, it.stamp.description].join(" "),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return sortStampItems(result, f.sort ?? "name");
}

export function sortStampItems(items: StampItem[], sort: CatalogSort): StampItem[] {
  const copy = [...items];
  if (sort === "date") {
    copy.sort((a, b) => b.stamp.createdAt.localeCompare(a.stamp.createdAt));
  } else {
    copy.sort(
      (a, b) =>
        a.place.name.localeCompare(b.place.name, "ru") ||
        (a.stamp.name ?? "").localeCompare(b.stamp.name ?? "", "ru"),
    );
  }
  return copy;
}

export type AvailabilityFilter = "" | "available" | "unavailable";

export interface PlaceFilters {
  query?: string;
  category?: OrganizationType | "";
  availability?: AvailabilityFilter;
  passportId?: string;
}

export function filterPlaceItems(items: PlaceItem[], f: PlaceFilters): PlaceItem[] {
  const q = f.query ? norm(f.query) : "";
  return items.filter((it) => {
    if (f.category && it.organization.type !== f.category) return false;
    if (f.passportId && !it.passportIds.includes(f.passportId)) return false;
    if (f.availability === "available" && !it.stamps.some((s) => s.availability === "available")) return false;
    if (f.availability === "unavailable" && it.stamps.some((s) => s.availability === "available")) return false;
    if (q && !norm(`${it.place.name} ${it.city.name} ${it.region.name}`).includes(q)) return false;
    return true;
  });
}

/** Number of published stamps per city, computed from data (never hard-coded). */
export function countStampsByCity(items: StampItem[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) m.set(it.city.id, (m.get(it.city.id) ?? 0) + 1);
  return m;
}

export function countStampsByRegion(items: StampItem[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) m.set(it.region.id, (m.get(it.region.id) ?? 0) + 1);
  return m;
}

export interface ProgressRow {
  id: string;
  name: string;
  collected: number;
  total: number;
}

/** Collection progress grouped by city or region. Only groups with at least one stamp. */
export function collectionProgress(
  items: StampItem[],
  collectedIds: Set<string>,
  by: "city" | "region",
): ProgressRow[] {
  const rows = new Map<string, ProgressRow>();
  for (const it of items) {
    const key = by === "city" ? it.city : it.region;
    const row = rows.get(key.id) ?? { id: key.id, name: key.name, collected: 0, total: 0 };
    row.total += 1;
    if (collectedIds.has(it.stamp.id)) row.collected += 1;
    rows.set(key.id, row);
  }
  return [...rows.values()].sort((a, b) => b.collected - a.collected || a.name.localeCompare(b.name, "ru"));
}
