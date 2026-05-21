"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { applyStoreDistances } from "@/lib/location/apply-distances";
import { NYC_CENTER } from "@/lib/location/constants";
import {
  getStoredLocation,
  saveDeniedLocation,
  saveGrantedLocation,
} from "@/lib/location/storage";
import type { Coordinates, LocationStatus } from "@/lib/location/types";
import type { NearbyStore } from "@/lib/nearby/types";

type UseGeolocationOptions = {
  /** When true, show permission prompt if location is not yet decided */
  promptOnMount?: boolean;
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { promptOnMount = false } = options;
  const [status, setStatus] = useState<LocationStatus>("unknown");
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = getStoredLocation();
    if (stored?.status === "granted") {
      setUserCoords({
        latitude: stored.latitude,
        longitude: stored.longitude,
      });
      setStatus("granted");
    } else if (stored?.status === "denied") {
      setStatus("denied");
    } else {
      setStatus("unknown");
      if (promptOnMount) setShowPrompt(true);
    }
    setHydrated(true);
  }, [promptOnMount]);

  const origin = useMemo(
    () => userCoords ?? NYC_CENTER,
    [userCoords],
  );

  const usesNycFallback = status !== "granted";

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      saveDeniedLocation();
      setStatus("denied");
      setShowPrompt(false);
      return;
    }

    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        saveGrantedLocation(coords.latitude, coords.longitude);
        setUserCoords(coords);
        setStatus("granted");
        setShowPrompt(false);
        setIsRequesting(false);
      },
      () => {
        saveDeniedLocation();
        setUserCoords(null);
        setStatus("denied");
        setShowPrompt(false);
        setIsRequesting(false);
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 300_000 },
    );
  }, []);

  const openPrompt = useCallback(() => {
    if (status === "granted") return;
    if (status === "denied") return;
    setShowPrompt(true);
  }, [status]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    if (status === "unknown") {
      saveDeniedLocation();
      setStatus("denied");
    }
  }, [status]);

  const withDistances = useCallback(
    (stores: NearbyStore[]) => applyStoreDistances(stores, origin),
    [origin],
  );

  return {
    hydrated,
    status,
    showPrompt,
    isRequesting,
    usesNycFallback,
    origin,
    requestLocation,
    openPrompt,
    dismissPrompt,
    setShowPrompt,
    withDistances,
  };
}
