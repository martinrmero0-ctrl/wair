import { SOCIAL_POSTS } from "./posts";
import type { SocialPost } from "./types";

export type SocialUserProfile = {
  username: string;
  location: string;
  aesthetics: string[];
  following: number;
  followers: number;
};

export const SOCIAL_USERS: Record<string, SocialUserProfile> = {
  alexromero: {
    username: "alexromero",
    location: "New York City",
    aesthetics: ["Japanese Americana", "Workwear", "Vintage Denim"],
    following: 128,
    followers: 342,
  },
  styleuser: {
    username: "styleuser",
    location: "Brooklyn, NY",
    aesthetics: ["Ametora", "Streetwear", "Minimalist"],
    following: 89,
    followers: 1204,
  },
  usernyc: {
    username: "usernyc",
    location: "Manhattan",
    aesthetics: ["Ivy League", "Vintage Denim", "Workwear"],
    following: 56,
    followers: 210,
  },
  yevouser: {
    username: "yevouser",
    location: "New York City",
    aesthetics: ["Japanese Americana", "Streetwear"],
    following: 42,
    followers: 18,
  },
};

export function normalizeUsername(username: string): string {
  return username.replace(/^@/, "").toLowerCase().trim();
}

export function getUserProfile(
  username: string,
): SocialUserProfile | undefined {
  return SOCIAL_USERS[normalizeUsername(username)];
}

export function getPostsByUsername(username: string): SocialPost[] {
  const key = normalizeUsername(username);
  return SOCIAL_POSTS.filter((post) => post.username === key);
}

export function getPostCount(username: string): number {
  return getPostsByUsername(username).length;
}
