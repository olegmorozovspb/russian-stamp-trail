import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { AdminSnapshot } from "@/services/catalog";
import type { Place, PublicationStatus, Stamp, SubmissionStatus, VerificationLog } from "@/types/domain";

/**
 * DEMO admin state: an in-memory copy of the catalog, kept only while the admin
 * section is open. Real publishing will go through server-side checks (Supabase RLS + roles).
 */
export type AdminState = AdminSnapshot;

type Entity = "places" | "stamps" | "passports" | "organizations" | "cities" | "regions";

export type AdminAction =
  | { type: "upsertPlace"; place: Place }
  | { type: "upsertStamp"; stamp: Stamp; passportIds: string[] }
  | { type: "setStatus"; entity: Entity; id: string; status: PublicationStatus }
  | { type: "setSubmissionStatus"; id: string; status: SubmissionStatus }
  | { type: "addVerification"; log: VerificationLog };

const now = () => new Date().toISOString();

export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "upsertPlace": {
      const exists = state.places.some((p) => p.id === action.place.id);
      const place = { ...action.place, updatedAt: now() };
      return { ...state, places: exists ? state.places.map((p) => (p.id === place.id ? place : p)) : [place, ...state.places] };
    }
    case "upsertStamp": {
      const exists = state.stamps.some((s) => s.id === action.stamp.id);
      const stamp = { ...action.stamp, updatedAt: now() };
      const passportStamps = [
        ...state.passportStamps.filter((l) => l.stampId !== stamp.id),
        ...action.passportIds.map((passportId) => ({ passportId, stampId: stamp.id })),
      ];
      return {
        ...state,
        stamps: exists ? state.stamps.map((s) => (s.id === stamp.id ? stamp : s)) : [stamp, ...state.stamps],
        passportStamps,
      };
    }
    case "setStatus": {
      const list = state[action.entity] as { id: string; status: PublicationStatus; updatedAt: string }[];
      return {
        ...state,
        [action.entity]: list.map((x) => (x.id === action.id ? { ...x, status: action.status, updatedAt: now() } : x)),
      };
    }
    case "setSubmissionStatus":
      return {
        ...state,
        submissions: state.submissions.map((s) => (s.id === action.id ? { ...s, status: action.status, updatedAt: now() } : s)),
      };
    case "addVerification": {
      const log = action.log;
      const touch = <T extends { id: string; lastVerifiedAt: string | null }>(arr: T[]) =>
        arr.map((x) => (x.id === log.targetId ? { ...x, lastVerifiedAt: log.checkedAt } : x));
      return {
        ...state,
        verificationLogs: [log, ...state.verificationLogs],
        places: log.targetType === "place" ? touch(state.places) : state.places,
        stamps: log.targetType === "stamp" ? touch(state.stamps) : state.stamps,
      };
    }
  }
}

const Ctx = createContext<{ state: AdminState; dispatch: React.Dispatch<AdminAction> } | null>(null);

export function AdminProvider({ initial, children }: { initial: AdminSnapshot; children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
