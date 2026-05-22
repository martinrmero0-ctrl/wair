"use client";

import { useState } from "react";
import { SOCIAL_POSTS } from "@/lib/social/posts";
import { SocialMapOverlay } from "./SocialMapOverlay";
import { SocialPostCard } from "./SocialPostCard";

export function SocialView() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4">
        <h1 className="text-3xl font-medium italic text-black">Social</h1>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="border border-black/20 px-4 py-1.5 text-sm tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
        >
          Map
        </button>
      </header>

      <div className="flex-1">
        {SOCIAL_POSTS.map((post) => (
          <SocialPostCard key={post.id} post={post} />
        ))}
      </div>

      <SocialMapOverlay open={mapOpen} onClose={() => setMapOpen(false)} />
    </main>
  );
}
