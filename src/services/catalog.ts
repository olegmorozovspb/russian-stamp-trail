/**
 * Catalog service: page-level view models composed from raw tables.
 * Pages call these via TanStack Query options in ./queries.ts.
 */
import type { City, Passport, Region, Route, Submission, VerificationLog } from "@/types/domain";
import { dataSource } from "./data-source";
import {
  buildPlaceItems,
  buildStampItems,
  countStampsByCity,
  isPublic,
  type CatalogSnapshot,
  type PlaceItem,
  type StampItem,
} from "./catalog-logic";

async function loadSnapshot(): Promise<CatalogSnapshot> {
  const [regions, cities, organizations, places, stamps, passports, passportStamps, routes] = await Promise.all([
    dataSource.listRegions(),
    dataSource.listCities(),
    dataSource.listOrganizations(),
    dataSource.listPlaces(),
    dataSource.listStamps(),
    dataSource.listPassports(),
    dataSource.listPassportStamps(),
    dataSource.listCuratedRoutes(),
  ]);
  return { regions, cities, organizations, places, stamps, passports, passportStamps, routes };
}

export interface CatalogIndex {
  snapshot: CatalogSnapshot;
  stampItems: StampItem[];
  placeItems: PlaceItem[];
  regions: Region[];
  cities: City[];
  passports: Passport[];
}

async function loadIndex(): Promise<CatalogIndex> {
  const snapshot = await loadSnapshot();
  const stampItems = buildStampItems(snapshot);
  const placeItems = buildPlaceItems(stampItems, snapshot);
  return {
    snapshot,
    stampItems,
    placeItems,
    regions: snapshot.regions.filter(isPublic),
    cities: snapshot.cities.filter(isPublic),
    passports: snapshot.passports.filter(isPublic),
  };
}

export interface CitySummary {
  city: City;
  region: Region;
  stampCount: number;
}

export interface PassportSummary {
  passport: Passport;
  stampCount: number;
}

export interface RouteSummary {
  route: Route;
  stops: PlaceItem[];
  cities: City[];
}

function summarizePassports(idx: CatalogIndex): PassportSummary[] {
  return idx.passports.map((passport) => ({
    passport,
    stampCount: idx.stampItems.filter((s) => s.passportIds.includes(passport.id)).length,
  }));
}

function summarizeRoute(route: Route, idx: CatalogIndex): RouteSummary {
  const byId = new Map(idx.placeItems.map((p) => [p.place.id, p]));
  const stops = [...route.stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => byId.get(s.placeId))
    .filter((p): p is PlaceItem => !!p);
  const cities = idx.cities.filter((c) => route.cityIds.includes(c.id));
  return { route, stops, cities };
}

function citySummaries(idx: CatalogIndex): CitySummary[] {
  const counts = countStampsByCity(idx.stampItems);
  const regionById = new Map(idx.regions.map((r) => [r.id, r]));
  return idx.cities
    .map((city) => ({ city, region: regionById.get(city.regionId)!, stampCount: counts.get(city.id) ?? 0 }))
    .filter((c) => c.region && c.stampCount > 0)
    .sort((a, b) => b.stampCount - a.stampCount || a.city.name.localeCompare(b.city.name, "ru"));
}

export const catalogService = {
  getIndex: loadIndex,

  async getHome() {
    const idx = await loadIndex();
    const newStamps = [...idx.stampItems].sort((a, b) => b.stamp.createdAt.localeCompare(a.stamp.createdAt)).slice(0, 6);
    return {
      cities: citySummaries(idx).slice(0, 8),
      newStamps,
      routes: idx.snapshot.routes.filter(isPublic).map((r) => summarizeRoute(r, idx)),
      passports: summarizePassports(idx),
    };
  },

  async getCatalog() {
    const idx = await loadIndex();
    return { items: idx.stampItems, regions: idx.regions, cities: idx.cities };
  },

  async getMap() {
    const idx = await loadIndex();
    return { places: idx.placeItems, passports: idx.passports };
  },

  async getPlace(placeId: string) {
    const idx = await loadIndex();
    const item = idx.placeItems.find((p) => p.place.id === placeId);
    if (!item) return null;
    const passports = idx.passports.filter((p) => item.passportIds.includes(p.id));
    const stampPassports: Record<string, string[]> = {};
    for (const s of idx.stampItems) if (s.place.id === placeId) stampPassports[s.stamp.id] = s.passportIds;
    const otherPlacesOfOrg = idx.placeItems.filter(
      (p) => p.organization.id === item.organization.id && p.place.id !== placeId,
    );
    return { ...item, passports, stampPassports, otherPlacesOfOrg };
  },

  async getCity(cityId: string) {
    const idx = await loadIndex();
    const city = idx.cities.find((c) => c.id === cityId);
    if (!city) return null;
    const region = idx.regions.find((r) => r.id === city.regionId) ?? null;
    const stamps = idx.stampItems.filter((s) => s.city.id === cityId);
    const places = idx.placeItems.filter((p) => p.city.id === cityId);
    const passportIds = new Set(stamps.flatMap((s) => s.passportIds));
    const passports = summarizePassports(idx).filter((p) => passportIds.has(p.passport.id));
    const routes = idx.snapshot.routes
      .filter((r) => isPublic(r) && r.cityIds.includes(cityId))
      .map((r) => summarizeRoute(r, idx));
    return { city, region, stamps, places, passports, routes };
  },

  async getRegion(regionId: string) {
    const idx = await loadIndex();
    const region = idx.regions.find((r) => r.id === regionId);
    if (!region) return null;
    const stamps = idx.stampItems.filter((s) => s.region.id === regionId);
    const places = idx.placeItems.filter((p) => p.region.id === regionId);
    const counts = countStampsByCity(stamps);
    const cities = idx.cities
      .filter((c) => c.regionId === regionId)
      .map((city) => ({ city, region, stampCount: counts.get(city.id) ?? 0 }));
    const passportIds = new Set(stamps.flatMap((s) => s.passportIds));
    const passports = summarizePassports(idx).filter(
      (p) => passportIds.has(p.passport.id) || p.passport.regionIds.includes(regionId),
    );
    return { region, cities, stamps, places, passports };
  },

  async getPassports() {
    const idx = await loadIndex();
    return summarizePassports(idx);
  },

  async getPassport(passportId: string) {
    const idx = await loadIndex();
    const passport = idx.passports.find((p) => p.id === passportId);
    if (!passport) return null;
    const order = new Map(
      idx.snapshot.passportStamps.filter((l) => l.passportId === passportId).map((l) => [l.stampId, l.position ?? 0]),
    );
    const stamps = idx.stampItems
      .filter((s) => s.passportIds.includes(passportId))
      .sort((a, b) => (order.get(a.stamp.id) ?? 0) - (order.get(b.stamp.id) ?? 0));
    const regions = idx.regions.filter((r) => passport.regionIds.includes(r.id));
    return { passport, stamps, regions };
  },

  async getCuratedRoutes() {
    const idx = await loadIndex();
    return idx.snapshot.routes.filter(isPublic).map((r) => summarizeRoute(r, idx));
  },

  async getRoute(routeId: string) {
    const idx = await loadIndex();
    const route = idx.snapshot.routes.find((r) => r.id === routeId && isPublic(r));
    return route ? summarizeRoute(route, idx) : null;
  },
};

/** Admin view: every record regardless of status. Demo-only, no access control yet. */
export interface AdminSnapshot extends CatalogSnapshot {
  submissions: Submission[];
  verificationLogs: VerificationLog[];
}

export const adminService = {
  async getSnapshot(): Promise<AdminSnapshot> {
    const [snapshot, submissions, verificationLogs] = await Promise.all([
      loadSnapshot(),
      dataSource.listSubmissions(),
      dataSource.listVerificationLogs(),
    ]);
    return { ...snapshot, submissions, verificationLogs };
  },
};
