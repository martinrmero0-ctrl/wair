"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile } from "@/lib/profile/storage";
import {
  CURRENT_USER_USERNAME,
  getFollowerCount,
  isFollowing,
  toggleFollow,
} from "@/lib/social/follows";
import { computeTasteMatch } from "@/lib/social/taste-match";
import { getPostsByUsername } from "@/lib/social/users";
import type { SocialUserProfile } from "@/lib/social/users";
import { initialsFromUsername } from "@/lib/social/utils";
import { TasteMatchBadge } from "./TasteMatchBadge";
import { UserProfilePostTile } from "./UserProfilePostTile";

type UserProfileViewProps = {
  profile: SocialUserProfile;
  postCount: number;
};

export function UserProfileView({ profile, postCount }: UserProfileViewProps) {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(profile.followers);
  const posts = getPostsByUsername(profile.username);
  const isSelf = profile.username === CURRENT_USER_USERNAME;

  const refreshFollowState = useCallback(() => {
    setFollowing(isFollowing(profile.username));
    setFollowerCount(getFollowerCount(profile.username));
  }, [profile.username]);

  useEffect(() => {
    refreshFollowState();
  }, [refreshFollowState]);

  const tasteMatch = useMemo(() => {
    if (isSelf) return 0;
    const viewerAesthetics = getProfile().aesthetics;
    return computeTasteMatch(viewerAesthetics, profile.aesthetics);
  }, [isSelf, profile.aesthetics]);

  const handleFollow = () => {
    toggleFollow(profile.username);
    refreshFollowState();
  };

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white">
      <div className="px-6 py-8">
        <Link
          href="/social"
          className="text-sm tracking-wide text-black/45 transition-colors hover:text-black"
        >
          ← Back to Social
        </Link>

        <div className="mt-8 flex flex-col items-center text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border border-black/15 bg-white text-xl font-medium tracking-wide text-black"
            aria-hidden
          >
            {initialsFromUsername(profile.username)}
          </div>
          <h1 className="mt-4 text-2xl font-medium text-black">
            @{profile.username}
          </h1>
          <p className="mt-1 text-sm text-black/50">{profile.location}</p>

          {!isSelf && tasteMatch > 0 ? (
            <TasteMatchBadge percent={tasteMatch} />
          ) : null}

          {!isSelf ? (
            <button
              type="button"
              onClick={handleFollow}
              className={[
                "mt-5 min-w-[8rem] border px-6 py-2 text-sm tracking-wide uppercase transition-colors",
                following
                  ? "border-black bg-white text-black"
                  : "border-black bg-black text-white hover:opacity-85",
              ].join(" ")}
            >
              {following ? "Following" : "Follow"}
            </button>
          ) : (
            <Link
              href="/profile"
              className="mt-5 border border-black/20 px-6 py-2 text-sm tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Edit profile
            </Link>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-10 border-y border-black/10 py-5">
          <div className="text-center">
            <p className="text-lg font-medium text-black">{postCount}</p>
            <p className="text-xs tracking-wide text-black/45 uppercase">
              Posts
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-black">{profile.following}</p>
            <p className="text-xs tracking-wide text-black/45 uppercase">
              Following
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-black">{followerCount}</p>
            <p className="text-xs tracking-wide text-black/45 uppercase">
              Followers
            </p>
          </div>
        </div>

        {profile.aesthetics.length > 0 ? (
          <div className="mt-6">
            <p className="mb-3 text-center text-xs tracking-[0.2em] text-black/40 uppercase">
              Aesthetics
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {profile.aesthetics.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/12 px-3 py-1 text-xs text-black/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-black/10 px-6 py-6">
        <h2 className="mb-4 text-sm tracking-[0.15em] text-black/45 uppercase">
          Recent posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-center text-black/40">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {posts.map((post) => (
              <UserProfilePostTile key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
