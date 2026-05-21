import type { NearbyStore } from "@/lib/nearby/types";
import { haversineMiles } from "./haversine";
import type { Coordinates } from "./types";

export function applyStoreDistances(
  stores: NearbyStore[],
  origin: Coordinates,
): NearbyStore[] {
  return stores.map((store) => ({
    ...store,
    distanceMiles:
      Math.round(
        haversineMiles(origin, {
          latitude: store.latitude,
          longitude: store.longitude,
        }) * 10,
      ) / 10,
  }));
}
