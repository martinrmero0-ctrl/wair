"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationPermissionPrompt } from "@/components/location/LocationPermissionPrompt";
import { LocationStatusBanner } from "@/components/location/LocationStatusBanner";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  getBookmarkedStoreIds,
  toggleStoreBookmark,
} from "@/lib/nearby/bookmarks";
import { filterStores, sortStores } from "@/lib/nearby/filter-sort";
import { NYC_STORES } from "@/lib/nearby/stores";
import type { StoreSort, StoreTagFilter } from "@/lib/nearby/types";
import { NearbySort } from "./NearbySort";
import { NearbyTagFilters } from "./NearbyTagFilters";
import { StoreCard } from "./StoreCard";

export function NearbyView() {
  const searchParams = useSearchParams();
  const locateFromHome = searchParams.get("locate") === "1";

  const {
    hydrated: geoHydrated,
    status: locationStatus,
    showPrompt,
    isRequesting,
    usesNycFallback,
    requestLocation,
    dismissPrompt,
    setShowPrompt,
    withDistances,
  } = useGeolocation({ promptOnMount: true });

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<StoreTagFilter>("all");
  const [sort, setSort] = useState<StoreSort>("nearest");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarkedStoreIds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (locateFromHome && geoHydrated && locationStatus === "unknown") {
      setShowPrompt(true);
    }
  }, [locateFromHome, geoHydrated, locationStatus, setShowPrompt]);

  const stores = useMemo(() => {
    const withDistance = withDistances(NYC_STORES);
    const filtered = filterStores(withDistance, query, tag);
    return sortStores(filtered, sort);
  }, [query, tag, sort, withDistances]);

  const handleToggleBookmark = useCallback((id: string) => {
    toggleStoreBookmark(id);
    setBookmarks(getBookmarkedStoreIds());
  }, []);

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white">
      <LocationPermissionPrompt
        open={showPrompt}
        loading={isRequesting}
        onAllow={requestLocation}
        onDismiss={dismissPrompt}
      />

      <header className="px-6 pt-6 pb-4">
        <h1 className="mb-4 text-center text-3xl font-medium italic text-black">
          Explore
        </h1>

        {geoHydrated && (
          <LocationStatusBanner usesNycFallback={usesNycFallback} />
        )}

        <label htmlFor="explore-search" className="sr-only">
          Search stores
        </label>
        <input
          id="explore-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stores, styles, neighborhoods…"
          className="w-full border border-black/15 bg-white px-5 py-3.5 text-base text-black placeholder:text-black/35 outline-none focus:border-black/40"
        />

        <div className="mt-4">
          <NearbyTagFilters value={tag} onChange={setTag} />
        </div>

        <div className="mt-4 border-b border-black/10">
          <NearbySort value={sort} onChange={setSort} />
        </div>
      </header>

      <div className="flex-1 px-6 py-6">
        {!hydrated || !geoHydrated ? (
          <p className="text-center text-black/40">Loading…</p>
        ) : stores.length === 0 ? (
          <p className="text-center text-lg text-black/45">
            No stores match your search.
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {stores.map((store) => (
              <li key={store.id}>
                <StoreCard
                  store={store}
                  bookmarked={bookmarks.includes(store.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
