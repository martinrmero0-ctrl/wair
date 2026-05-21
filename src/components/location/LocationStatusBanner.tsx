import { NYC_FALLBACK_LABEL } from "@/lib/location/constants";

type LocationStatusBannerProps = {
  usesNycFallback: boolean;
};

export function LocationStatusBanner({
  usesNycFallback,
}: LocationStatusBannerProps) {
  if (!usesNycFallback) return null;

  return (
    <p className="mb-4 text-center text-sm text-black/45">
      Distances from {NYC_FALLBACK_LABEL}.{" "}
      <span className="text-black/60">
        Enable location for accurate distances.
      </span>
    </p>
  );
}
