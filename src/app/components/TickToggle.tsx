type TickToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export function TickToggle({ checked, onChange, label }: TickToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <div
        className={`relative w-12 h-7 rounded-full transition-colors duration-300
          ${checked ? "bg-indigo-400" : "bg-gray-600"}`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md
            transform transition-transform duration-300
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>

      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
