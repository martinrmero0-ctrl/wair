"use client";

import { StorePinsMap } from "@/components/maps/StorePinsMap";
import type { NearbyStore } from "@/lib/nearby/types";

type ExploreMapProps = {
  stores: NearbyStore[];
  bookmarkedIds: string[];
};

export function ExploreMap({ stores, bookmarkedIds }: ExploreMapProps) {
  return (
    <StorePinsMap
      stores={stores}
      bookmarkedIds={bookmarkedIds}
      className="relative min-h-[min(520px,calc(100dvh-var(--nav-height)-18rem))] w-full flex-1"
    />
  );
}
