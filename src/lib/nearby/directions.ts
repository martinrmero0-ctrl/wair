export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  const isIpadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return isAppleMobile || isIpadOs;
}

export function getDirectionsUrl(address: string): string {
  const destination = encodeURIComponent(address);

  if (isIOSDevice()) {
    return `maps://maps.apple.com/?daddr=${destination}&dirflg=w`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
}
