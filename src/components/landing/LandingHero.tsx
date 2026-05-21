"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchResponse } from "@/lib/search/types";
import { SearchResultsGrid } from "./SearchResultsGrid";
import { SearchModeToggle, type SearchMode } from "./SearchModeToggle";

export function LandingHero() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("both");
  const [results, setResults] = useState<SearchResponse["results"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const isResultsView = trimmedQuery.length > 0;

  const clearSearch = useCallback(() => {
    abortRef.current?.abort();
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isResultsView) clearSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isResultsView, clearSearch]);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    const timeout = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );

        const data = (await response.json()) as SearchResponse & {
          error?: string;
        };

        if (!response.ok) {
          setResults([]);
          setError(data.error ?? "Something went wrong. Try again.");
          return;
        }

        setResults(data.results ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
        setError("Could not reach search. Check your connection.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [trimmedQuery]);

  return (
    <main
      className={[
        "relative flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white transition-[padding] duration-500 ease-out",
        isResultsView ? "px-6 pt-6 pb-12" : "items-center justify-center px-6",
      ].join(" ")}
    >
      {isResultsView && (
        <button
          type="button"
          aria-label="Close search results"
          className="fixed inset-0 z-0 cursor-default"
          onClick={clearSearch}
        />
      )}

      <div
        ref={contentRef}
        className={[
          "relative z-10 flex w-full flex-col transition-all duration-500 ease-out",
          isResultsView ? "mx-auto max-w-6xl" : "max-w-md items-center text-center",
        ].join(" ")}
      >
        <header
          className={[
            "w-full transition-all duration-500 ease-out",
            isResultsView
              ? "mb-6 text-center"
              : "mb-0 text-center",
          ].join(" ")}
        >
          <p
            className={[
              "font-light tracking-wide text-black/80 transition-all duration-500 ease-out",
              isResultsView ? "mb-2 text-sm" : "mb-4 text-lg",
            ].join(" ")}
          >
            For you, by you.
          </p>

          <h1
            className={[
              "font-medium italic tracking-tight text-black transition-all duration-500 ease-out",
              isResultsView
                ? "mb-6 text-4xl leading-none sm:text-5xl"
                : "mb-12 text-[4.5rem] leading-none sm:text-[5.5rem]",
            ].join(" ")}
          >
            Wair
          </h1>
        </header>

        <div
          className={[
            "w-full transition-all duration-500 ease-out",
            isResultsView ? "max-w-2xl self-center" : "",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
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
              autoComplete="off"
            />
          </form>

          <div
            className={[
              "w-full transition-all duration-500 ease-out",
              isResultsView
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 overflow-hidden opacity-0",
            ].join(" ")}
            aria-hidden={!isResultsView}
          >
            <SearchResultsGrid
              results={results}
              loading={loading}
              error={error}
              query={trimmedQuery}
            />
          </div>
        </div>

        <div
          className={[
            "w-full transition-all duration-500 ease-out",
            isResultsView
              ? "max-h-0 overflow-hidden opacity-0"
              : "max-h-40 opacity-100",
          ].join(" ")}
          aria-hidden={isResultsView}
        >
          <SearchModeToggle value={mode} onChange={setMode} />
        </div>
      </div>
    </main>
  );
}
