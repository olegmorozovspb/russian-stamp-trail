import { useMemo, useRef } from "react";
import type { PlaceItem } from "@/services/catalog-logic";
import { StampMap, type StampMapHandle } from "./StampMap";

/** Numbered stops + dashed straight line. The line is NOT a road route. */
export function RouteMap({
  stops,
  onSelect,
  mapRef,
  className,
}: {
  stops: PlaceItem[];
  onSelect?: (placeId: string) => void;
  mapRef?: React.RefObject<StampMapHandle | null>;
  className?: string;
}) {
  const localRef = useRef<StampMapHandle>(null);
  const markers = useMemo(
    () =>
      stops.map((p, i) => ({
        id: p.place.id,
        lat: p.place.location.lat,
        lng: p.place.location.lng,
        title: `${i + 1}. ${p.place.name}`,
        number: i + 1,
      })),
    [stops],
  );
  const line = useMemo(() => stops.map((p) => [p.place.location.lat, p.place.location.lng] as [number, number]), [stops]);
  return (
    <StampMap
      ref={mapRef ?? localRef}
      markers={markers}
      line={line}
      cluster={false}
      fitToMarkers
      onSelect={onSelect}
      className={className ?? "h-72 rounded-lg border border-border lg:h-[420px]"}
    />
  );
}
