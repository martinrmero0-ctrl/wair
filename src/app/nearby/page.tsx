import type { Metadata } from "next";
import { Suspense } from "react";
import { NearbyView } from "@/components/nearby/NearbyView";

export const metadata: Metadata = {
  title: "Explore — Yevo",
};

export default function NearbyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center bg-white">
          <p className="text-black/40">Loading…</p>
        </main>
      }
    >
      <NearbyView />
    </Suspense>
  );
}
