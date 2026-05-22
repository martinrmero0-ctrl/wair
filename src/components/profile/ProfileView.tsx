"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  DEFAULT_AESTHETIC_TAGS,
  SHOE_SIZES,
  TOP_SIZES,
  WAIST_SIZES,
} from "@/lib/profile/options";
import { DEFAULT_PROFILE, getProfile, saveProfile } from "@/lib/profile/storage";
import type { UserProfile } from "@/lib/profile/types";
import { ProfileSection } from "./ProfileSection";
import { ProfileToggle } from "./ProfileToggle";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="h-10 w-10 text-black/35"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

function formatBudgetLabel(value: number) {
  if (value >= BUDGET_MAX) return "No limit";
  return `Up to $${value.toLocaleString("en-US")} per piece`;
}

export function ProfileView() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [customInput, setCustomInput] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setHydrated(true);
  }, []);

  const updateProfile = useCallback((next: UserProfile) => {
    setProfile(next);
    saveProfile(next);
  }, []);

  const allAestheticTags = useMemo(() => {
    const preset = [...DEFAULT_AESTHETIC_TAGS] as string[];
    const custom = profile.customTags.filter((tag) => !preset.includes(tag));
    return [...preset, ...custom];
  }, [profile.customTags]);

  const toggleAesthetic = (tag: string) => {
    const active = profile.aesthetics.includes(tag);
    const aesthetics = active
      ? profile.aesthetics.filter((t) => t !== tag)
      : [...profile.aesthetics, tag];
    updateProfile({ ...profile, aesthetics });
  };

  const addCustomAesthetic = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (profile.aesthetics.includes(trimmed)) {
      setCustomInput("");
      return;
    }
    const customTags = profile.customTags.includes(trimmed)
      ? profile.customTags
      : [...profile.customTags, trimmed];
    updateProfile({
      ...profile,
      customTags,
      aesthetics: [...profile.aesthetics, trimmed],
    });
    setCustomInput("");
  };

  const handleSaveProfile = () => {
    saveProfile(profile);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center bg-white">
        <p className="text-black/40">Loading profile…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white">
      <div className="mx-auto w-full max-w-lg flex-1 px-6 pt-6 pb-28">
        <h1 className="mb-8 text-center text-3xl font-medium italic text-black">
          Profile
        </h1>

        <div className="flex flex-col items-center pb-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-black/15 bg-white">
            <UserIcon />
          </div>
          <p className="mt-4 text-xl font-medium text-black">yevo user</p>
          <p className="mt-1 text-sm text-black/50">New York City</p>
        </div>

        <ProfileSection title="My sizes">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs tracking-wide text-black/45 uppercase">
                Top
              </span>
              <select
                value={profile.sizes.top}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    sizes: { ...profile.sizes, top: e.target.value },
                  })
                }
                className="border border-black/15 bg-white px-2 py-2.5 text-sm text-black outline-none focus:border-black/40"
              >
                {TOP_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs tracking-wide text-black/45 uppercase">
                Waist
              </span>
              <select
                value={profile.sizes.waist}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    sizes: { ...profile.sizes, waist: e.target.value },
                  })
                }
                className="border border-black/15 bg-white px-2 py-2.5 text-sm text-black outline-none focus:border-black/40"
              >
                {WAIST_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs tracking-wide text-black/45 uppercase">
                Shoe
              </span>
              <select
                value={profile.sizes.shoe}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    sizes: { ...profile.sizes, shoe: e.target.value },
                  })
                }
                className="border border-black/15 bg-white px-2 py-2.5 text-sm text-black outline-none focus:border-black/40"
              >
                {SHOE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </ProfileSection>

        <ProfileSection title="My aesthetics">
          <div className="flex flex-wrap gap-2">
            {allAestheticTags.map((tag) => {
              const isActive = profile.aesthetics.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleAesthetic(tag)}
                  className={[
                    "px-3 py-1.5 text-sm tracking-wide transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "border border-black/20 text-black hover:border-black/50",
                  ].join(" ")}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomAesthetic();
                }
              }}
              placeholder="Add your own…"
              className="min-w-0 flex-1 border border-black/15 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none focus:border-black/40"
            />
            <button
              type="button"
              onClick={addCustomAesthetic}
              aria-label="Add aesthetic tag"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-black bg-black text-xl text-white hover:opacity-85"
            >
              +
            </button>
          </div>
        </ProfileSection>

        <ProfileSection title="Budget range">
          <p className="mb-4 text-center text-lg text-black">
            {formatBudgetLabel(profile.budgetMax)}
          </p>
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={10}
            value={profile.budgetMax}
            onChange={(e) =>
              updateProfile({
                ...profile,
                budgetMax: Number(e.target.value),
              })
            }
            className="w-full accent-black"
          />
          <div className="mt-2 flex justify-between text-xs text-black/40">
            <span>${BUDGET_MIN}</span>
            <span>No limit</span>
          </div>
        </ProfileSection>

        <ProfileSection title="Connected accounts">
          <div className="flex flex-col divide-y divide-black/10">
            {(
              [
                { id: "tiktok", label: "TikTok" },
                { id: "instagram", label: "Instagram" },
              ] as const
            ).map(({ id, label }) => {
              const connected = profile.connected[id];
              return (
                <div
                  key={id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-base text-black">{label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile({
                        ...profile,
                        connected: {
                          ...profile.connected,
                          [id]: !connected,
                        },
                      })
                    }
                    className={[
                      "flex items-center gap-2 border px-4 py-1.5 text-sm tracking-wide transition-colors",
                      connected
                        ? "border-black/20 text-black"
                        : "border-black bg-black text-white hover:opacity-85",
                    ].join(" ")}
                  >
                    {connected && (
                      <span
                        className="h-2 w-2 rounded-full bg-emerald-600"
                        aria-hidden
                      />
                    )}
                    {connected ? "Connected" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </ProfileSection>

        <ProfileSection title="Notifications">
          <div className="divide-y divide-black/10">
            <ProfileToggle
              label="Daily swipe deck"
              checked={profile.notifications.dailyDeck}
              onChange={(dailyDeck) =>
                updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, dailyDeck },
                })
              }
            />
            <ProfileToggle
              label="Restock alerts"
              checked={profile.notifications.restockAlerts}
              onChange={(restockAlerts) =>
                updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, restockAlerts },
                })
              }
            />
            <ProfileToggle
              label="New nearby spots"
              checked={profile.notifications.nearbySpots}
              onChange={(nearbySpots) =>
                updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, nearbySpots },
                })
              }
            />
          </div>
        </ProfileSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white px-6 py-4">
        <div className="mx-auto w-full max-w-lg">
          <button
            type="button"
            onClick={handleSaveProfile}
            className="w-full bg-black py-3.5 text-base tracking-wide text-white transition-opacity hover:opacity-85"
          >
            {savedFlash ? "Saved" : "Save profile"}
          </button>
        </div>
      </div>
    </main>
  );
}
