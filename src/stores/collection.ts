import { useMemo } from "react";
import type { UserCollection } from "@/types/domain";
import { toggleCollected } from "@/lib/collection-logic";
import { createLocalStore } from "./local-store";

/**
 * Local collection (guest mode). When Supabase Auth is connected, replace the
 * storage with a `user_collections` table keyed by user id; the hook API stays.
 */
const store = createLocalStore<UserCollection[]>("stamps.collection.v1", []);

export const collectionActions = {
  toggle: (stampId: string) => store.set((prev) => toggleCollected(prev, stampId)),
  clear: () => store.set([]),
};

export function useCollection() {
  const list = store.useStore();
  const ids = useMemo(() => new Set(list.map((c) => c.stampId)), [list]);
  return { list, ids, ...collectionActions };
}
