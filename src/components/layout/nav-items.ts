import { BookOpen, Compass, Home, LibraryBig, Map, Stamp, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/i18n";

export interface NavItem {
  to: "/" | "/map" | "/catalog" | "/passports" | "/collection" | "/routes";
  label: (t: Dictionary) => string;
  short?: (t: Dictionary) => string;
  icon: LucideIcon;
  exact?: boolean;
}

/** Five primary sections shown in the mobile bottom bar */
export const primaryNav: NavItem[] = [
  { to: "/", label: (t) => t.nav.home, icon: Home, exact: true },
  { to: "/map", label: (t) => t.nav.map, icon: Map },
  { to: "/catalog", label: (t) => t.nav.catalog, icon: LibraryBig },
  { to: "/passports", label: (t) => t.nav.passports, icon: BookOpen },
  { to: "/collection", label: (t) => t.nav.collection, short: (t) => t.nav.collectionShort, icon: Stamp },
];

export const secondaryNav: NavItem[] = [{ to: "/routes", label: (t) => t.nav.routes, icon: Compass }];
