import type { StoredLocationPreference } from "./types";

const LOCATION_KEY = "wair-user-location";

export function getStoredLocation(): StoredLocationPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as StoredLocationPreference) : null;
  } catch {
    return null;
  }
}

export function saveGrantedLocation(latitude: number, longitude: number): void {
  const preference: StoredLocationPreference = {
    status: "granted",
    latitude,
    longitude,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCATION_KEY, JSON.stringify(preference));
}

export function saveDeniedLocation(): void {
  const preference: StoredLocationPreference = {
    status: "denied",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCATION_KEY, JSON.stringify(preference));
}

export function clearStoredLocation(): void {
  localStorage.removeItem(LOCATION_KEY);
}
