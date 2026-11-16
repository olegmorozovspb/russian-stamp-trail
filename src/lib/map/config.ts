/**
 * Map provider configuration. Swap tiles/attribution here (or replace StampMap's
 * implementation) to change provider without touching pages or business logic.
 * OpenStreetMap tiles are used on-demand only — never bulk-downloaded or cached.
 */
export const mapConfig = {
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  subdomains: ["a", "b", "c"],
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">участники OpenStreetMap</a>',
  maxZoom: 19,
  /** Initial view covering Russia */
  russiaView: { center: [61, 82] as [number, number], zoom: 3 },
  minZoom: 2,
};
