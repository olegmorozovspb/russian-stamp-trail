import { queryOptions } from "@tanstack/react-query";
import { adminService, catalogService } from "./catalog";

/** Demo data never changes during a session; with Supabase lower this. */
const staleTime = 5 * 60 * 1000;

export const homeQuery = queryOptions({ queryKey: ["home"], queryFn: () => catalogService.getHome(), staleTime });
export const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => catalogService.getCatalog(), staleTime });
export const mapQuery = queryOptions({ queryKey: ["map"], queryFn: () => catalogService.getMap(), staleTime });
export const passportsQuery = queryOptions({ queryKey: ["passports"], queryFn: () => catalogService.getPassports(), staleTime });
export const curatedRoutesQuery = queryOptions({ queryKey: ["routes"], queryFn: () => catalogService.getCuratedRoutes(), staleTime });
export const adminSnapshotQuery = queryOptions({ queryKey: ["admin", "snapshot"], queryFn: () => adminService.getSnapshot(), staleTime });

export const placeQuery = (placeId: string) =>
  queryOptions({ queryKey: ["place", placeId], queryFn: () => catalogService.getPlace(placeId), staleTime });
export const cityQuery = (cityId: string) =>
  queryOptions({ queryKey: ["city", cityId], queryFn: () => catalogService.getCity(cityId), staleTime });
export const regionQuery = (regionId: string) =>
  queryOptions({ queryKey: ["region", regionId], queryFn: () => catalogService.getRegion(regionId), staleTime });
export const passportQuery = (passportId: string) =>
  queryOptions({ queryKey: ["passport", passportId], queryFn: () => catalogService.getPassport(passportId), staleTime });
export const routeQuery = (routeId: string) =>
  queryOptions({ queryKey: ["route", routeId], queryFn: () => catalogService.getRoute(routeId), staleTime });
