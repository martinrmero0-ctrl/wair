type ProfileToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ProfileToggle({ label, checked, onChange }: ProfileToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="text-base text-black">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 border transition-colors",
          checked ? "border-black bg-black" : "border-black/25 bg-white",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 bg-white transition-transform",
            checked ? "left-[1.35rem] bg-white" : "left-0.5 bg-black",
          ].join(" ")}
        />
      </button>
    </label>
  );
}
