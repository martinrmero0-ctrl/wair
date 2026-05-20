"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OneSignal from "react-onesignal";
import { ONESIGNAL_APP_ID } from "@/lib/onesignal/config";

export function useOneSignal() {
  const [isReady, setIsReady] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(false);
  const initStarted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initStarted.current) return;
    initStarted.current = true;

    const init = async () => {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
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
        console.error("OneSignal initialization failed:", error);
      }
    };

    init();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isReady) return false;

    try {
      const granted = await OneSignal.Notifications.requestPermission();
      setPermission(granted);
      return granted;
    } catch (error) {
      console.error("OneSignal permission request failed:", error);
      return false;
    }
  }, [isReady]);

  return {
    isReady,
    isSupported,
    permission,
    requestPermission,
  };
}
