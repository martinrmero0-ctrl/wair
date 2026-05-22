"use client";

import { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { NYC_CENTER } from "@/lib/location/constants";
import { MINIMAL_MAP_STYLE } from "@/lib/maps/styles";
import { createStoreMarkerOverlay } from "@/lib/maps/store-marker";
import type { NearbyStore } from "@/lib/nearby/types";
import { MapStoreInfoCard } from "@/components/nearby/MapStoreInfoCard";

type StorePinsMapProps = {
  stores: NearbyStore[];
  bookmarkedIds: string[];
  className?: string;
};

export function StorePinsMap({
  stores,
  bookmarkedIds,
  className = "h-full w-full min-h-[320px]",
}: StorePinsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<google.maps.OverlayView[]>([]);
  const { ready, error } = useGoogleMaps();
  const [selectedStore, setSelectedStore] = useState<NearbyStore | null>(null);

  useEffect(() => {
    if (!ready || !mapContainerRef.current || !window.google?.maps) return;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: NYC_CENTER.latitude, lng: NYC_CENTER.longitude },
      zoom: 13,
      styles: MINIMAL_MAP_STYLE,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
    });

    mapRef.current = map;

    const closeListener = map.addListener("click", () => {
      setSelectedStore(null);
    });

    return () => {
      google.maps.event.removeListener(closeListener);
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      mapRef.current = null;
    };
  }, [ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !window.google?.maps || stores.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    stores.forEach((store) => {
      bounds.extend({ lat: store.latitude, lng: store.longitude });
    });

    if (stores.length === 1) {
      map.setCenter(bounds.getCenter()!);
      map.setZoom(14);
    } else {
      map.fitBounds(bounds, 48);
    }
  }, [ready, stores]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !window.google?.maps) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    stores.forEach((store) => {
      const bookmarked = bookmarkedIds.includes(store.id);
      const selected = selectedStore?.id === store.id;
      const overlay = createStoreMarkerOverlay(
        store,
        bookmarked,
        selected,
        (s) => setSelectedStore(s),
      );
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });
  }, [ready, stores, bookmarkedIds, selectedStore?.id]);

  if (error) {
    return (
      <p className="flex h-full items-center justify-center px-6 text-center text-black/45">
        {error}
      </p>
    );
  }

  if (!ready) {
    return (
      <p className="flex h-full items-center justify-center text-black/40">
        Loading map…
      </p>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedStore ? (
        <div className="absolute inset-x-4 bottom-4 z-10 max-w-md">
          <MapStoreInfoCard
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
