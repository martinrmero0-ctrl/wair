"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useOneSignal } from "@/hooks/useOneSignal";
import { ONESIGNAL_SDK_URL } from "@/lib/onesignal/config";
import { isOneSignalEnvironment } from "@/lib/onesignal/environment";

/** Loads the OneSignal SDK and initializes it only on HTTPS. */
export function OneSignalInit() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setShouldLoad(isOneSignalEnvironment());
  }, []);

  useOneSignal();

  if (!shouldLoad) return null;

  return (
    <Script
      id="onesignal-sdk"
      src={ONESIGNAL_SDK_URL}
      strategy="afterInteractive"
    />
  );
}
