"use client";

import { useOneSignal } from "@/hooks/useOneSignal";

/** Initializes OneSignal on the client via useOneSignal. */
export function OneSignalInit() {
  useOneSignal();
  return null;
}
