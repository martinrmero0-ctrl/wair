type ProgressPipsProps = {
  total: number;
  completed: number;
};

export function ProgressPips({ total, completed }: ProgressPipsProps) {
  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${total - completed} cards remaining`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={[
            "h-1.5 w-1.5 rounded-full transition-colors duration-300",
            i < completed ? "bg-black" : "bg-black/15",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
