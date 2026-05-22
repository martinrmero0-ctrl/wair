import { SOCIAL_POSTS } from "./posts";
import type { SocialPost } from "./types";

export function getRecentPostsByUsername(
  username: string,
  limit = 3,
): SocialPost[] {
  return SOCIAL_POSTS.filter((post) => post.username === username).slice(
    0,
    limit,
  );
}
