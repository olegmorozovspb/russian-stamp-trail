import type {
  City,
  Organization,
  Passport,
  PassportStamp,
  Place,
  Region,
  Route,
  Stamp,
  Submission,
  VerificationLog,
} from "@/types/domain";
import { demoDataSource } from "./demo-source";

/**
 * Raw table access. Each method maps 1:1 to a future Supabase table query.
 * To switch to Supabase: implement this interface in `supabase-source.ts`
 * and change the `dataSource` export below — UI code does not change.
 */
export interface CatalogDataSource {
  listRegions(): Promise<Region[]>;
  listCities(): Promise<City[]>;
  listOrganizations(): Promise<Organization[]>;
  listPlaces(): Promise<Place[]>;
  listStamps(): Promise<Stamp[]>;
  listPassports(): Promise<Passport[]>;
  listPassportStamps(): Promise<PassportStamp[]>;
  listCuratedRoutes(): Promise<Route[]>;
  listSubmissions(): Promise<Submission[]>;
  listVerificationLogs(): Promise<VerificationLog[]>;
}

export const dataSource: CatalogDataSource = demoDataSource;
