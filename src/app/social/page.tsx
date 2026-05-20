import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social — Wair",
};

export default function SocialPage() {
  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col items-center justify-center bg-white px-6">
      <h1 className="text-3xl font-medium italic text-black">Social</h1>
      <p className="mt-3 text-center text-lg text-black/55">
        Coming soon — your fashion feed.
      </p>
    </main>
  );
}
