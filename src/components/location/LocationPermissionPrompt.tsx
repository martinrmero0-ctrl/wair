type LocationPermissionPromptProps = {
  open: boolean;
  loading?: boolean;
  onAllow: () => void;
  onDismiss: () => void;
};

export function LocationPermissionPrompt({
  open,
  loading = false,
  onAllow,
  onDismiss,
}: LocationPermissionPromptProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-prompt-title"
    >
      <div className="w-full max-w-sm border border-black/10 bg-white p-8 text-center shadow-sm">
        <p
          id="location-prompt-title"
          className="text-xl leading-snug font-medium text-black"
        >
          See what&apos;s near you
        </p>
        <p className="mt-3 text-sm leading-relaxed text-black/55">
          Yevo uses your location to show accurate distances to vintage and
          streetwear stores in the city.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onAllow}
            disabled={loading}
            className="w-full bg-black py-3 text-sm tracking-wide text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Locating…" : "Allow location"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            disabled={loading}
            className="w-full border border-black/20 py-3 text-sm tracking-wide text-black/55 uppercase transition-colors hover:border-black/40 hover:text-black disabled:opacity-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
