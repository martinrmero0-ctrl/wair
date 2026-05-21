"use client";

import { useEffect, useState } from "react";
import {
  getDirectionsUrl,
  getGoogleMapsDirectionsUrl,
} from "@/lib/nearby/directions";

/**
 * Returns a directions URL without SSR/client hydration mismatches.
 * Server and first paint use Google Maps; iOS devices switch to Apple Maps after mount.
 */
export function useDirectionsUrl(address: string): string {
  const [url, setUrl] = useState(() => getGoogleMapsDirectionsUrl(address));

  useEffect(() => {
    setUrl(getDirectionsUrl(address));
  }, [address]);

  return url;
}
