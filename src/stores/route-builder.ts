import { addStop, moveStop, removeStop, type DraftStop } from "@/lib/route-logic";
import { createLocalStore } from "./local-store";

const store = createLocalStore<DraftStop[]>("stamps.route.v1", []);

export const routeActions = {
  add: (placeId: string) => store.set((s) => addStop(s, placeId)),
  addMany: (placeIds: string[]) => store.set((s) => placeIds.reduce(addStop, s)),
  remove: (placeId: string) => store.set((s) => removeStop(s, placeId)),
  move: (index: number, dir: -1 | 1) => store.set((s) => moveStop(s, index, dir)),
  clear: () => store.set([]),
};

export function useRouteBuilder() {
  const stops = store.useStore();
  return { stops, has: (placeId: string) => stops.some((s) => s.placeId === placeId), ...routeActions };
}
