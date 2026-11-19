import { describe, expect, it } from "vitest";
import { catalogService } from "./catalog";
import { collectionProgress, countStampsByCity, filterPlaceItems, filterStampItems } from "./catalog-logic";

describe("catalog rules", () => {
  it("public catalog hides drafts and stamps awaiting review", async () => {
    const { items } = await catalogService.getCatalog();
    const ids = items.map((i) => i.stamp.id);
    expect(ids).not.toContain("s-kazan-draft");
    expect(ids).not.toContain("s-irkutsk-pending");
  });

  it("every demo stamp is flagged as demo data", async () => {
    const { items } = await catalogService.getCatalog();
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.stamp.isDemo && i.place.isDemo)).toBe(true);
  });

  it("a stamp can exist without its own name", async () => {
    const { items } = await catalogService.getCatalog();
    expect(items.some((i) => i.stamp.name == null)).toBe(true);
  });

  it("one place can hold several stamps", async () => {
    const place = await catalogService.getPlace("p-suzdal-house");
    expect(place?.stamps.map((s) => s.id)).toEqual(["s-suzdal-house-1", "s-suzdal-house-2"]);
  });

  it("city stamp count is computed from published data", async () => {
    const { items } = await catalogService.getCatalog();
    const counts = countStampsByCity(items);
    expect(counts.get("kazan")).toBe(3); // 2 at the info centre + 1 at the art space; the draft is excluded
  });

  it("filters by region, city and category", async () => {
    const { items } = await catalogService.getCatalog();
    const r = filterStampItems(items, { regionId: "vladimir-obl", category: "tourist_center" });
    expect(r.map((i) => i.stamp.id).sort()).toEqual(["s-suzdal-tic", "s-vladimir-tic"]);
  });

  it("sorts by date added, newest first", async () => {
    const { items } = await catalogService.getCatalog();
    const r = filterStampItems(items, { sort: "date" });
    expect(r[0]?.stamp.id).toBe("s-spb-pereplet");
  });

  it("search ignores case and ё/е", async () => {
    const { items } = await catalogService.getCatalog();
    expect(filterStampItems(items, { query: "ЗЕЛЕНОГРАДСК" }).map((i) => i.stamp.id)).toEqual(["s-zelenogradsk-mayak"]);
  });

  it("map passport filter keeps only places with stamps from that passport", async () => {
    const { places } = await catalogService.getMap();
    const r = filterPlaceItems(places, { passportId: "pp-baltic" });
    expect(r.map((p) => p.place.id).sort()).toEqual(["p-kaliningrad-library", "p-zelenogradsk-mayak"]);
  });

  it("collection progress groups by city", async () => {
    const { items } = await catalogService.getCatalog();
    const rows = collectionProgress(items, new Set(["s-kazan-tic-1"]), "city");
    expect(rows.find((r) => r.id === "kazan")).toEqual({ id: "kazan", name: "Казань", collected: 1, total: 3 });
  });
});
