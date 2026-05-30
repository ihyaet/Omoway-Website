"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

import type { DealerLocation } from "@/lib/dealer-locator-section-types";

type DealerLocatorMapProps = {
  dealers: DealerLocation[];
  selectedId: string;
};

function markerIcon(selected: boolean): L.DivIcon {
  const fill = selected ? "#2563eb" : "#3b82f6";
  return L.divIcon({
    className: "dealer-locator-pin",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" aria-hidden="true">
      <path fill="${fill}" d="M14 0C6.3 0 0 6.1 0 13.6 0 24 14 36 14 36s14-12 14-22.4C28 6.1 21.7 0 14 0z"/>
      <circle cx="14" cy="13" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

export function DealerLocatorMap({ dealers, selectedId }: DealerLocatorMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    map.setView([-2.5, 118], 5);

    const resize = () => {
      map.invalidateSize();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    requestAnimationFrame(resize);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => {
      m.remove();
    });
    markersRef.current = [];

    dealers.forEach((d) => {
      const marker = L.marker([d.lat, d.lng], {
        icon: markerIcon(d.id === selectedId),
      }).addTo(map);
      markersRef.current.push(marker);
    });

    const selected = dealers.find((d) => d.id === selectedId);
    if (selected) {
      const z = Math.max(map.getZoom(), 11);
      map.flyTo([selected.lat, selected.lng], z, { duration: 0.5 });
    } else if (dealers.length > 0) {
      const bounds = L.latLngBounds(dealers.map((d) => [d.lat, d.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [dealers, selectedId]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 w-full min-w-0 flex-1"
    />
  );
}
