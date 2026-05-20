type DeckTasteLabelProps = {
  historyCount: number;
};

const PERSONALIZED_THRESHOLD = 5;

export function DeckTasteLabel({ historyCount }: DeckTasteLabelProps) {
  const label =
    historyCount >= PERSONALIZED_THRESHOLD
      ? "Picked for you"
      : "Discovering your taste";

  return (
    <p className="mt-3 text-center text-sm text-black/40">{label}</p>
  );
}
