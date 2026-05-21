import { haversineMiles } from "@/lib/location/haversine";
import { NYC_CENTER } from "@/lib/location/constants";
import { getStoredLocation } from "@/lib/location/storage";
import { getGoogleShoppingUrl } from "@/lib/search/google-shopping";
import { NYC_STORES } from "@/lib/nearby/stores";
import { PIECE_CATALOG } from "@/lib/swipe/catalog";
import type { SearchResult } from "./types";

const CARD_COLORS = [
  "#e8e4dc",
  "#c9d4ce",
  "#ddd5cc",
  "#d4c4bc",
  "#c5c9d0",
  "#e2d6d0",
  "#bcc8c4",
  "#ebe6e1",
  "#d8d4c8",
  "#c4b8a8",
];

export type EnrichedSearchResult = SearchResult & {
  color: string;
  distanceMiles?: number;
  isOpen?: boolean;
};

function hashColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

function getDistanceOrigin() {
  const stored = getStoredLocation();
  if (stored?.status === "granted") {
    return {
      latitude: stored.latitude,
      longitude: stored.longitude,
    };
  }
  return NYC_CENTER;
}

function findStoreByName(name: string) {
  const normalized = name.toLowerCase().trim();
  return NYC_STORES.find(
    (store) =>
      store.name.toLowerCase() === normalized ||
      normalized.includes(store.name.toLowerCase()) ||
      store.name.toLowerCase().includes(normalized),
  );
}

function findCatalogPiece(brand: string, name: string) {
  const b = brand.toLowerCase().trim();
  const n = name.toLowerCase().trim();
  return PIECE_CATALOG.find(
    (piece) =>
      piece.brand.toLowerCase() === b &&
      (piece.name.toLowerCase() === n ||
        n.includes(piece.name.toLowerCase()) ||
        piece.name.toLowerCase().includes(n)),
  );
}

export function enrichSearchResult(result: SearchResult): EnrichedSearchResult {
  if (result.type === "store") {
    const store = findStoreByName(result.name);
    const origin = getDistanceOrigin();
    return {
      ...result,
      color: store?.color ?? hashColor(result.name),
      distanceMiles: store
        ? haversineMiles(origin, {
            latitude: store.latitude,
            longitude: store.longitude,
          })
        : undefined,
      isOpen: store?.isOpen ?? true,
    };
  }

  if (result.type === "piece") {
    const catalogMatch = result.brand
      ? findCatalogPiece(result.brand, result.name)
      : undefined;
    const seed = `${result.brand ?? ""}-${result.name}`;
    return {
      ...result,
      color: catalogMatch?.color ?? hashColor(seed),
      url: getGoogleShoppingUrl(result.brand ?? "", result.name),
    };
  }

  return {
    ...result,
    color: hashColor(result.name),
  };
}

export function enrichSearchResults(
  results: SearchResult[],
): EnrichedSearchResult[] {
  return results.map(enrichSearchResult);
}

export function formatResultUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}
