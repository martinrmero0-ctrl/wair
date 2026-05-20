"use client";

export type SearchMode = "online" | "near-me" | "both";

const MODES: { id: SearchMode; label: string }[] = [
  { id: "online", label: "Online" },
  { id: "near-me", label: "Near me" },
  { id: "both", label: "Both" },
];

type SearchModeToggleProps = {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
};

export function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="group"
      aria-label="Search mode"
    >
      {MODES.map((mode) => {
        const isActive = value === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(mode.id)}
            className={[
              "min-w-[5.5rem] px-5 py-2 text-sm tracking-wide transition-colors",
              isActive
                ? "bg-black text-white"
                : "bg-white text-black border border-black/20 hover:border-black/50",
            ].join(" ")}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
