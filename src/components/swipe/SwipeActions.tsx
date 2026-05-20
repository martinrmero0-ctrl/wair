type SwipeActionsProps = {
  onPass: () => void;
  onSave: () => void;
  disabled?: boolean;
};

export function SwipeActions({ onPass, onSave, disabled }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-10">
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass"
        className="flex h-14 w-14 items-center justify-center border border-black/25 text-2xl text-black/60 transition-colors hover:border-black hover:text-black disabled:opacity-30"
      >
        ←
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        aria-label="Save to wishlist"
        className="flex h-14 w-14 items-center justify-center border border-black bg-black text-2xl text-white transition-opacity hover:opacity-85 disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}
