export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  const isIpadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return isAppleMobile || isIpadOs;
}

/** Stable Google Maps URL — safe for SSR and initial client render. */
export function getGoogleMapsDirectionsUrl(address: string): string {
  const destination = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
}

/** Prefer Apple Maps on iOS after hydration; Google Maps elsewhere. */
export function getDirectionsUrl(address: string): string {
  const destination = encodeURIComponent(address);

  if (isIOSDevice()) {
    return `maps://maps.apple.com/?daddr=${destination}&dirflg=w`;
  }

  return getGoogleMapsDirectionsUrl(address);
}
