import { describe, expect, it } from "vitest";
import { addStop, moveStop, removeStop, straightLineKm } from "./route-logic";
import { toggleCollected } from "./collection-logic";

describe("route builder", () => {
  it("does not add the same place twice", () => {
    expect(addStop(addStop([], "a"), "a")).toHaveLength(1);
  });

  it("moves a stop up and down and ignores out-of-range moves", () => {
    const s = ["a", "b", "c"].reduce(addStop, [] as ReturnType<typeof addStop>);
    expect(moveStop(s, 2, -1).map((x) => x.placeId)).toEqual(["a", "c", "b"]);
    expect(moveStop(s, 0, -1)).toBe(s);
    expect(removeStop(s, "b").map((x) => x.placeId)).toEqual(["a", "c"]);
  });

  it("straight-line distance Moscow → St Petersburg is about 634 km", () => {
    const km = straightLineKm({ lat: 55.7558, lng: 37.6173 }, { lat: 59.9343, lng: 30.3351 });
    expect(Math.round(km)).toBeGreaterThan(625);
    expect(Math.round(km)).toBeLessThan(640);
  });
});

describe("collection", () => {
  it("toggles a stamp on and off, guest collections have no user id", () => {
    const on = toggleCollected([], "s1", "2026-01-01T00:00:00Z");
    expect(on).toEqual([{ id: "local-s1", userId: null, stampId: "s1", collectedAt: "2026-01-01T00:00:00Z" }]);
    expect(toggleCollected(on, "s1")).toEqual([]);
  });
});
