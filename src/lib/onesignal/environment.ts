/** True when web push / OneSignal should run (HTTPS production, not local HTTP). */
export function isOneSignalEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}
