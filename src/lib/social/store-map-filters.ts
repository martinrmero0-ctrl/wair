import { NYC_STORES } from "@/lib/nearby/stores";
import type { NearbyStore } from "@/lib/nearby/types";
import type { SocialMapTab } from "./types";

/** Stores the current user has rated (mock until profile sync). */
const USER_RATED_STORE_IDS = [
  "blue-in-green",
  "tokio-7",
  "artifact-nyc",
  "what-goes-around",
];

/** Stores the current user has visited (mock). */
const USER_BEEN_STORE_IDS = [
  "blue-in-green",
  "front-general-store",
  "tokio-7",
  "procell",
  "l-train-vintage",
];

export function getStoresForSocialMapTab(
  tab: SocialMapTab,
  bookmarkedIds: string[],
): NearbyStore[] {
  switch (tab) {
    case "rated":
      return NYC_STORES.filter((s) => USER_RATED_STORE_IDS.includes(s.id));
    case "been":
      return NYC_STORES.filter((s) => USER_BEEN_STORE_IDS.includes(s.id));
    case "want-to-try":
      return NYC_STORES.filter((s) => bookmarkedIds.includes(s.id));
    case "friends-recs":
      return NYC_STORES.filter((s) => s.friendRated);
    case "trending":
    default:
      return [...NYC_STORES].sort((a, b) => b.rating - a.rating);
  }
}
