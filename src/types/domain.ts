/**
 * Domain model. Shapes mirror future Supabase tables (snake_case mapping happens in services).
 * Place, Organization, Stamp and Passport are deliberately separate entities:
 * - an Organization can run several Places;
 * - a Place can host several Stamps;
 * - a Stamp can belong to several Passports (via PassportStamp).
 */

export type ID = string;
/** ISO 8601 date-time string */
export type ISODate = string;

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Timestamps {
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type PublicationStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "needs_update"
  | "temporarily_unavailable"
  | "archived";

/** Statuses visible to regular visitors */
export const PUBLIC_STATUSES: PublicationStatus[] = [
  "published",
  "needs_update",
  "temporarily_unavailable",
];

export type SourceType = "organizer" | "partner" | "user_submission" | "editorial" | "demo";

export interface SourceInfo {
  type: SourceType;
  name?: string;
  url?: string;
}

export interface Photo {
  id: ID;
  url: string;
  alt: string;
  credit?: string;
}

interface Publishable extends Timestamps {
  status: PublicationStatus;
  lastVerifiedAt: ISODate | null;
  source: SourceInfo;
  /** true for demo/test records that must never be presented as confirmed real data */
  isDemo: boolean;
}

export interface Region extends Timestamps {
  id: ID;
  name: string;
  description: string;
  center: LatLng;
  status: PublicationStatus;
}

export interface City extends Timestamps {
  id: ID;
  regionId: ID;
  name: string;
  description: string;
  location: LatLng;
  status: PublicationStatus;
}

export type OrganizationType =
  | "museum"
  | "tourist_center"
  | "cafe"
  | "bookstore"
  | "library"
  | "hotel"
  | "theatre"
  | "shop"
  | "park"
  | "other";

export interface Organization extends Publishable {
  id: ID;
  name: string;
  type: OrganizationType;
  description?: string;
  website?: string;
}

/** 0 = Monday ... 6 = Sunday */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayHours {
  day: Weekday;
  /** "HH:MM" or null when closed */
  open: string | null;
  close: string | null;
}

export interface OpeningHours {
  regular: DayHours[];
  note?: string;
}

export interface Place extends Publishable {
  id: ID;
  organizationId: ID;
  cityId: ID;
  /** Usually equals the venue name shown to visitors */
  name: string;
  address: string;
  location: LatLng;
  photos: Photo[];
  openingHours: OpeningHours;
  /** Temporary restrictions: renovation, seasonal closure, etc. */
  temporaryNotice?: string;
}

export type StampConditionType =
  | "free"
  | "purchase"
  | "ticket"
  | "ask_staff"
  | "own_passport"
  | "other";

export interface StampCondition {
  id: ID;
  type: StampConditionType;
  text: string;
}

export type StampPrice =
  | { kind: "free" }
  | { kind: "paid"; amount: number; currency: "RUB" }
  | { kind: "unknown" };

export type StampAvailability = "available" | "temporarily_unavailable" | "unknown";

export interface Stamp extends Publishable {
  id: ID;
  placeId: ID;
  /** Optional: many stamps have no name of their own */
  name?: string | null;
  description: string;
  photos: Photo[];
  conditions: StampCondition[];
  price: StampPrice;
  availability: StampAvailability;
}

export interface Passport extends Publishable {
  id: ID;
  name: string;
  coverImage?: Photo;
  /** Human-readable geography, e.g. «Золотое кольцо» */
  geography: string;
  regionIds: ID[];
  description: string;
  organizer: string;
  officialUrl?: string;
}

export interface PassportStamp {
  passportId: ID;
  stampId: ID;
  position?: number;
}

export interface UserCollection {
  id: ID;
  /** null while the collection lives only in this browser (before Supabase Auth) */
  userId: ID | null;
  stampId: ID;
  collectedAt: ISODate;
  note?: string;
}

export interface RouteStop {
  id: ID;
  routeId: ID;
  placeId: ID;
  position: number;
  note?: string;
}

export interface Route extends Timestamps {
  id: ID;
  title: string;
  description: string;
  kind: "curated" | "user";
  ownerId: ID | null;
  cityIds: ID[];
  stops: RouteStop[];
  status: PublicationStatus;
  isDemo: boolean;
}

export type SubmissionKind = "new_place" | "update" | "report_issue";
export type SubmissionStatus = "new" | "in_review" | "accepted" | "rejected";

export interface Submission extends Timestamps {
  id: ID;
  kind: SubmissionKind;
  targetType: "place" | "stamp" | "passport" | null;
  targetId: ID | null;
  summary: string;
  submittedBy: string;
  submitterRole: "visitor" | "partner";
  status: SubmissionStatus;
  isDemo: boolean;
}

export type VerificationResult = "confirmed" | "changed" | "unavailable";

export interface VerificationLog {
  id: ID;
  targetType: "place" | "stamp" | "passport";
  targetId: ID;
  checkedAt: ISODate;
  checkedBy: string;
  result: VerificationResult;
  note?: string;
}
