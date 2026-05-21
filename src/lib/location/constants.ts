import type { Coordinates } from "./types";

/** Manhattan center — fallback when location is denied or unavailable */
export const NYC_CENTER: Coordinates = {
  latitude: 40.758,
  longitude: -73.9855,
};

export const NYC_FALLBACK_LABEL = "NYC";
