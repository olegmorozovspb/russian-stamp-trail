import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { mapConfig } from "@/lib/map/config";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  tone?: "default" | "collected" | "muted";
  /** Shows a number inside the pin (route stops) */
  number?: number;
}

export interface StampMapHandle {
  resetView(): void;
  focus(lat: number, lng: number, zoom?: number): void;
}

interface StampMapProps {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Dashed straight line through points (route preview) */
  line?: [number, number][];
  cluster?: boolean;
  /** Fit view to markers on first render and when the marker set changes */
  fitToMarkers?: boolean;
  className?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * The only component that talks to Leaflet. Leaflet touches `window`, so it is
 * imported dynamically after mount — SSR renders just the container.
 */
export const StampMap = forwardRef<StampMapHandle, StampMapProps>(function StampMap(
  { markers, selectedId, onSelect, line, cluster = true, fitToMarkers = false, className },
  ref,
) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const layerRef = useRef<Leaflet.LayerGroup | null>(null);
  const lineRef = useRef<Leaflet.Polyline | null>(null);
  const markerRefs = useRef(new Map<string, Leaflet.Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const fitKeyRef = useRef<string>("");

  useImperativeHandle(ref, () => ({
    resetView() {
      const map = mapRef.current;
      if (!map) return;
      if (fitToMarkers && markers.length > 0 && LRef.current) {
        map.fitBounds(LRef.current.latLngBounds(markers.map((m) => [m.lat, m.lng])), { padding: [40, 40], maxZoom: 14 });
      } else {
        map.fitBounds(mapConfig.russiaBounds);
      }
    },
    focus(lat, lng, zoom = 15) {
      mapRef.current?.setView([lat, lng], zoom);
    },
  }));

  // Init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        (window as unknown as { L: typeof Leaflet }).L = L;
        await import("leaflet.markercluster");
        if (cancelled || !containerRef.current) return;
        LRef.current = L;
        const map = L.map(containerRef.current, {
          center: mapConfig.russiaView.center,
          zoom: mapConfig.russiaView.zoom,
          minZoom: mapConfig.minZoom,
          zoomControl: true,
          worldCopyJump: true,
          maxBounds: [
            [-85, -200],
            [85, 400],
          ],
          maxBoundsViscosity: 1,
        });
        map.fitBounds(mapConfig.russiaBounds);
        L.tileLayer(mapConfig.tileUrl, {
          subdomains: mapConfig.subdomains,
          maxZoom: mapConfig.maxZoom,
          attribution: mapConfig.attribution,
        }).addTo(map);
        map.attributionControl.setPrefix(false);
        mapRef.current = map;
        setStatus("ready");
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      lineRef.current = null;
      markerRefs.current.clear();
    };
  }, []);

  // Sync markers
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (status !== "ready" || !L || !map) return;
    layerRef.current?.remove();
    markerRefs.current.clear();
    const group: Leaflet.LayerGroup = cluster
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 50,
          iconCreateFunction: (c) =>
            L.divIcon({
              html: `<span class="stamp-cluster">${c.getChildCount()}</span>`,
              className: "stamp-pin-wrap",
              iconSize: [40, 40],
            }),
        })
      : L.layerGroup();
    for (const m of markers) {
      const marker = L.marker([m.lat, m.lng], {
        title: m.title,
        alt: m.title,
        keyboard: true,
        icon: L.divIcon({
          className: "stamp-pin-wrap",
          html: `<div class="stamp-pin stamp-pin--${m.tone ?? "default"}${m.number ? " has-number" : ""}"><span>${m.number ?? ""}</span></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        }),
      });
      marker.bindTooltip(escapeHtml(m.title), { direction: "top", offset: [0, -28] });
      marker.on("click", () => onSelectRef.current?.(m.id));
      marker.on("keypress", (e: Leaflet.LeafletKeyboardEvent) => {
        if (e.originalEvent.key === "Enter") onSelectRef.current?.(m.id);
      });
      group.addLayer(marker);
      markerRefs.current.set(m.id, marker);
    }
    group.addTo(map);
    layerRef.current = group;

    const key = markers.map((m) => m.id).join(",");
    if (fitToMarkers && markers.length > 0 && key !== fitKeyRef.current) {
      fitKeyRef.current = key;
      map.fitBounds(L.latLngBounds(markers.map((m) => [m.lat, m.lng])), { padding: [40, 40], maxZoom: 14 });
    }
  }, [markers, status, cluster, fitToMarkers]);

  // Sync line
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (status !== "ready" || !L || !map) return;
    lineRef.current?.remove();
    lineRef.current = null;
    if (line && line.length > 1) {
      lineRef.current = L.polyline(line, { color: "oklch(0.44 0.15 262)", weight: 3, dashArray: "6 8", opacity: 0.8 }).addTo(map);
    }
  }, [line, status]);

  // Highlight + reveal selected marker
  useEffect(() => {
    if (status !== "ready") return;
    markerRefs.current.forEach((marker, id) => {
      const el = marker.getElement()?.querySelector(".stamp-pin");
      el?.classList.toggle("stamp-pin--selected", id === selectedId);
    });
    if (!selectedId) return;
    const marker = markerRefs.current.get(selectedId);
    const group = layerRef.current as (Leaflet.MarkerClusterGroup & Leaflet.LayerGroup) | null;
    if (marker && group && "zoomToShowLayer" in group) {
      group.zoomToShowLayer(marker, () => {
        marker.getElement()?.querySelector(".stamp-pin")?.classList.add("stamp-pin--selected");
      });
    } else if (marker) {
      mapRef.current?.panTo(marker.getLatLng());
    }
  }, [selectedId, status, markers]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-paper-deep", className)}>
      <div ref={containerRef} className="absolute inset-0 z-0" role="region" aria-label={t.map.mapLabel} />
      {status !== "ready" && (
        <div className="absolute inset-0 z-10 grid place-items-center paper-grain p-6 text-center text-sm text-muted-foreground">
          {status === "loading" ? t.map.loadingMap : t.map.mapError}
        </div>
      )}
    </div>
  );
});
