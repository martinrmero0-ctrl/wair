"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OneSignal from "react-onesignal";
import { ONESIGNAL_APP_ID } from "@/lib/onesignal/config";
import { isOneSignalEnvironment } from "@/lib/onesignal/environment";

export function useOneSignal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(false);
  const initStarted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initStarted.current) return;

    if (!isOneSignalEnvironment()) {
      return;
    }

    initStarted.current = true;
    setIsEnabled(true);

    const init = async () => {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          welcomeNotification: {
            disable: true,
            message: "",
          },
        });

        setIsReady(true);
        setIsSupported(OneSignal.Notifications.isPushSupported());
        setPermission(OneSignal.Notifications.permission);
      } catch (error) {
        console.warn("OneSignal skipped:", error);
      }
    };

    init();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isReady || !isOneSignalEnvironment()) return false;

    try {
      const granted = await OneSignal.Notifications.requestPermission();
      setPermission(granted);
      return granted;
    } catch (error) {
      console.warn("OneSignal permission request failed:", error);
      return false;
    }
  }, [isReady]);

  return {
    isEnabled,
    isReady,
    isSupported,
    permission,
    requestPermission,
  };
}
