import type { UserCollection } from "@/types/domain";

/** Toggle a stamp in the collection. userId stays null until Supabase Auth exists. */
export function toggleCollected(
  list: UserCollection[],
  stampId: string,
  now: string = new Date().toISOString(),
): UserCollection[] {
  if (list.some((c) => c.stampId === stampId)) return list.filter((c) => c.stampId !== stampId);
  return [...list, { id: `local-${stampId}`, userId: null, stampId, collectedAt: now }];
}
