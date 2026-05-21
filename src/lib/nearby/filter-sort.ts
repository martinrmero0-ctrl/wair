import { resolveNeighborhoodFromQuery } from "./neighborhoods";
import type { NearbyStore, StoreSort, StoreTagFilter } from "./types";

export function filterStores(
  stores: NearbyStore[],
  query: string,
  tag: StoreTagFilter,
): NearbyStore[] {
  const normalized = query.trim().toLowerCase();
  const neighborhood = resolveNeighborhoodFromQuery(query);

  return stores.filter((store) => {
    const matchesTag = tag === "all" || store.tags.includes(tag);
    if (!matchesTag) return false;

    if (!normalized) return true;

    if (neighborhood) {
      return store.neighborhood === neighborhood;
    }

    const haystack = [
      store.name,
      store.type,
      store.neighborhood,
      ...store.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function sortStores(stores: NearbyStore[], sort: StoreSort): NearbyStore[] {
  const copy = [...stores];

  switch (sort) {
    case "top-rated":
      return copy.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
    case "open-now":
      return copy.sort((a, b) => {
        if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
        return a.distanceMiles - b.distanceMiles;
      });
    case "nearest":
    default:
      return copy.sort((a, b) => a.distanceMiles - b.distanceMiles);
  }
}
