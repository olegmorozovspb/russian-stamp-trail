import * as demo from "@/data/demo";
import type { CatalogDataSource } from "./data-source";

/** Returns copies so callers can never mutate the demo fixtures. */
const clone = <T>(v: T): Promise<T> => Promise.resolve(structuredClone(v));

export const demoDataSource: CatalogDataSource = {
  listRegions: () => clone(demo.demoRegions),
  listCities: () => clone(demo.demoCities),
  listOrganizations: () => clone(demo.demoOrganizations),
  listPlaces: () => clone(demo.demoPlaces),
  listStamps: () => clone(demo.demoStamps),
  listPassports: () => clone(demo.demoPassports),
  listPassportStamps: () => clone(demo.demoPassportStamps),
  listCuratedRoutes: () => clone(demo.demoRoutes),
  listSubmissions: () => clone(demo.demoSubmissions),
  listVerificationLogs: () => clone(demo.demoVerificationLogs),
};
