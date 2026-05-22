"use client";

import { useDirectionsUrl } from "@/hooks/useDirectionsUrl";
import { formatDistance } from "@/lib/nearby/format";
import type { NearbyStore } from "@/lib/nearby/types";

type MapStoreInfoCardProps = {
  store: NearbyStore;
  onClose: () => void;
};

export function MapStoreInfoCard({ store, onClose }: MapStoreInfoCardProps) {
  const directionsUrl = useDirectionsUrl(store.address);

  return (
    <div className="border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-medium leading-tight text-black">
            {store.name}
          </h2>
          <p className="mt-0.5 text-sm text-black/55">{store.type}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 text-black/35 transition-colors hover:text-black"
        >
          ×
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span>
          <span className="text-black">{store.rating.toFixed(1)}</span>
          <span className="text-black/40"> ★</span>
        </span>
        <span className="text-black/50">{formatDistance(store.distanceMiles)}</span>
        <span
          className={
            store.isOpen
              ? "text-black"
              : "text-black/40 uppercase tracking-wide text-xs"
          }
        >
          {store.isOpen ? "Open" : "Closed"}
        </span>
      </div>

      <div className="mt-4 flex justify-end border-t border-black/8 pt-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-black/20 px-4 py-1.5 text-xs tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
