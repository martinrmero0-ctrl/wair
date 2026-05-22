"use client";

import { useEffect, useState } from "react";

const SCRIPT_ID = "google-maps-js";

function getMapsApiKey(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!raw) return null;
  const clean = raw.replace(/\s/g, "").trim();
  return clean || null;
}

export function useGoogleMaps() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = getMapsApiKey();
    if (!key) {
      setError("Google Maps API key is not configured.");
      return;
    }

    if (typeof window !== "undefined" && window.google?.maps) {
      setReady(true);
      return;
    }

    const handleReady = () => setReady(true);
    const handleError = () =>
      setError("Failed to load Google Maps. Check your API key.");

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.maps) {
        setReady(true);
      } else {
        existing.addEventListener("load", handleReady);
        existing.addEventListener("error", handleError);
      }
      return () => {
        existing.removeEventListener("load", handleReady);
        existing.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.onload = handleReady;
    script.onerror = handleError;
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleReady);
      script.removeEventListener("error", handleError);
    };
  }, []);

  return { ready, error };
}
