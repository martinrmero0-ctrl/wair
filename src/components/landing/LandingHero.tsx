"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchModeToggle, type SearchMode } from "./SearchModeToggle";

export function LandingHero() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("both");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-6">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <p className="mb-4 text-lg font-light tracking-wide text-black/80">
          For you, by you.
        </p>

        <h1 className="mb-12 text-[4.5rem] leading-none font-medium italic tracking-tight text-black sm:text-[5.5rem]">
          Wair
        </h1>

        <form
          className="mb-8 w-full"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="search" className="sr-only">
            Search fashion
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, brands, aesthetics…"
            className="w-full border border-black/15 bg-white px-5 py-3.5 text-base text-black placeholder:text-black/35 outline-none focus:border-black/40"
          />
        </form>

        <SearchModeToggle value={mode} onChange={setMode} />

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link
            href="/swipe"
            className="text-sm tracking-wide text-black/50 underline-offset-4 hover:text-black hover:underline"
          >
            Today&apos;s deck
          </Link>
          <Link
            href="/wishlist"
            className="text-sm tracking-wide text-black/50 underline-offset-4 hover:text-black hover:underline"
          >
            Wishlist
          </Link>
          <Link
            href="/nearby"
            className="text-sm tracking-wide text-black/50 underline-offset-4 hover:text-black hover:underline"
          >
            Nearby
          </Link>
          <Link
            href="/profile"
            className="text-sm tracking-wide text-black/50 underline-offset-4 hover:text-black hover:underline"
          >
            Profile
          </Link>
        </nav>
      </div>
    </main>
  );
}
