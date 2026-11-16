/**
 * DEMO DATA entry point. Only src/services/demo-source.ts may import from here —
 * UI components must go through the services layer.
 */
export { demoRegions, demoCities } from "./geo";
export { demoOrganizations, demoPlaces, demoStamps } from "./catalog";
export { demoPassports, demoPassportStamps } from "./passports";
export { demoRoutes } from "./routes";
export { demoSubmissions, demoVerificationLogs } from "./admin";
