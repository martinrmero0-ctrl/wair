import { normalizeUsername } from "./users";

const FOLLOWING_KEY = "yevo-following";

/** Logged-in user for social actions on /profile */
export const CURRENT_USER_USERNAME = "yevouser";

/** Seed follower lists (who follows each user). */
const SEED_FOLLOWERS: Record<string, string[]> = {
  yevouser: ["alexromero", "styleuser"],
  alexromero: ["styleuser", "usernyc"],
  styleuser: ["alexromero", "usernyc", "yevouser"],
  usernyc: ["styleuser"],
};

export function getFollowingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FOLLOWING_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFollowing(username: string): boolean {
  const key = normalizeUsername(username);
  return getFollowingIds().includes(key);
}

export function toggleFollow(username: string): boolean {
  const key = normalizeUsername(username);
  const ids = getFollowingIds();
  const next = ids.includes(key)
    ? ids.filter((id) => id !== key)
    : [...ids, key];
  localStorage.setItem(FOLLOWING_KEY, JSON.stringify(next));
  return next.includes(key);
}

export function getFollowerIds(username: string): string[] {
  const key = normalizeUsername(username);
  const seed = SEED_FOLLOWERS[key] ?? [];
  const extras =
    isFollowing(key) && !seed.includes(CURRENT_USER_USERNAME)
      ? [CURRENT_USER_USERNAME]
      : [];
  return [...seed, ...extras];
}

export function getFollowerCount(username: string): number {
  return getFollowerIds(username).length;
}

export function getFollowingCountForCurrentUser(): number {
  return getFollowingIds().length;
}
