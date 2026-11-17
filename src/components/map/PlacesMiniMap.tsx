import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { PlaceItem } from "@/services/catalog-logic";
import { useCollection } from "@/stores/collection";
import { StampMap } from "./StampMap";

/** Compact map of a set of places; clicking a marker opens the place card. */
export function PlacesMiniMap({ places, className }: { places: PlaceItem[]; className?: string }) {
  const navigate = useNavigate();
  const { ids } = useCollection();
  const markers = useMemo(
    () =>
      places.map((p) => ({
        id: p.place.id,
        lat: p.place.location.lat,
        lng: p.place.location.lng,
        title: p.place.name,
        tone: p.stamps.every((s) => ids.has(s.id)) ? ("collected" as const) : ("default" as const),
      })),
    [places, ids],
  );
  return (
    <StampMap
      markers={markers}
      fitToMarkers
      cluster={places.length > 8}
      onSelect={(placeId) => navigate({ to: "/place/$placeId", params: { placeId } })}
      className={className ?? "h-72 rounded-lg border border-border"}
    />
  );
}
