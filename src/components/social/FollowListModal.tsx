"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CURRENT_USER_USERNAME,
  getFollowerIds,
  getFollowingIds,
  isFollowing,
  toggleFollow,
} from "@/lib/social/follows";
import { getUserProfile } from "@/lib/social/users";
import { initialsFromUsername } from "@/lib/social/utils";
import { UserAvatarLink, UsernameLink } from "./UserProfileLink";

type FollowListModalProps = {
  open: boolean;
  mode: "followers" | "following";
  profileUsername: string;
  onClose: () => void;
  onFollowChange?: () => void;
};

function FollowRow({
  username,
  onFollowChange,
}: {
  username: string;
  onFollowChange: () => void;
}) {
  const profile = getUserProfile(username);
  const [following, setFollowing] = useState(false);
  const isSelf = username === CURRENT_USER_USERNAME;

  useEffect(() => {
    setFollowing(isFollowing(username));
  }, [username]);

  const handleToggle = () => {
    if (isSelf) return;
    toggleFollow(username);
    setFollowing(isFollowing(username));
    onFollowChange();
  };

  if (!profile) return null;

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatarLink username={username} size="sm" />
        <div className="min-w-0">
          <UsernameLink username={username} className="text-sm" />
          <p className="text-xs text-black/45">{profile.location}</p>
        </div>
      </div>
      {isSelf ? (
        <span className="text-xs text-black/35">You</span>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          className={[
            "shrink-0 border px-3 py-1 text-xs tracking-wide transition-colors",
            following
              ? "border-black bg-white text-black"
              : "border-black bg-black text-white hover:opacity-85",
          ].join(" ")}
        >
          {following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

export function FollowListModal({
  open,
  mode,
  profileUsername,
  onClose,
  onFollowChange,
}: FollowListModalProps) {
  const [usernames, setUsernames] = useState<string[]>([]);

  const refresh = useCallback(() => {
    if (mode === "followers") {
      setUsernames(getFollowerIds(profileUsername));
    } else if (profileUsername === CURRENT_USER_USERNAME) {
      setUsernames(getFollowingIds());
    } else {
      setUsernames([]);
    }
    onFollowChange?.();
  }, [mode, profileUsername, onFollowChange]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const title = mode === "followers" ? "Followers" : "Following";

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/20 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="follow-list-title"
      onClick={onClose}
    >
      <div
        className="max-h-[70dvh] w-full max-w-md overflow-hidden border border-black/10 bg-white shadow-sm sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 id="follow-list-title" className="text-lg font-medium text-black">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-black/40 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto px-5">
          {usernames.length === 0 ? (
            <p className="py-8 text-center text-sm text-black/45">
              {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          ) : (
            <div className="divide-y divide-black/8">
              {usernames.map((username) => (
                <FollowRow
                  key={username}
                  username={username}
                  onFollowChange={refresh}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
