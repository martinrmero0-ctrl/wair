import { BUDGET_MAX } from "./options";
import type { UserProfile } from "./types";

const PROFILE_KEY = "wair-profile";

export const DEFAULT_PROFILE: UserProfile = {
  sizes: { top: "M", waist: "32", shoe: "10" },
  aesthetics: [],
  customTags: [],
  budgetMax: BUDGET_MAX,
  connected: { tiktok: false, instagram: false },
  notifications: {
    dailyDeck: true,
    restockAlerts: true,
    nearbySpots: false,
  },
};

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      sizes: { ...DEFAULT_PROFILE.sizes, ...parsed.sizes },
      connected: { ...DEFAULT_PROFILE.connected, ...parsed.connected },
      notifications: {
        ...DEFAULT_PROFILE.notifications,
        ...parsed.notifications,
      },
      customTags: parsed.customTags ?? [],
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
