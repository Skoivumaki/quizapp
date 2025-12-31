"use client";

import { useState } from "react";
import clsx from "clsx";
import { ButtonTheme } from "./Button";

interface SwitchBoxOption {
  label: string;
  value: string | number;
}

interface SwitchBoxProps {
  options: SwitchBoxOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  theme?: ButtonTheme;
}

export function SwitchBox({
  options,
  value: controlledValue,
  onChange,
  theme = ButtonTheme.PRIMARY,
}: SwitchBoxProps) {
  const [internalValue, setInternalValue] = useState(
    controlledValue ?? options[0]?.value
  );
  const currentValue = controlledValue ?? internalValue;

  const handleClick = (val: string | number) => {
    if (!controlledValue) setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div className="relative inline-flex w-full bg-gray-900 rounded-full border-2 border-pink-400 overflow-hidden isolate">
      {options.map((opt, index) => {
        const isActive = opt.value === currentValue;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className={clsx(
              "flex-1 relative font-semibold transition-all duration-200 px-4 py-2 text-sm select-none text-center",
              "rounded-full",

              !isFirst && "-ml-px",
              isActive ? "z-20" : "z-10",

              theme === ButtonTheme.PRIMARY2 &&
                (isActive
                  ? "bg-green-500 text-black"
                  : "bg-transparent text-green-400"),
              theme === ButtonTheme.PRIMARY &&
                (isActive
                  ? "bg-pink-400 text-black"
                  : "bg-transparent text-pink-400"),

              theme === ButtonTheme.INVERT &&
                (isActive
                  ? "transparent text-black"
                  : "bg-green-500 text-green-400"),

              theme === ButtonTheme.CLEAR &&
                (isActive
                  ? "bg-green-500 text-black"
                  : "border-green-500/70 text-green-400"),
              isFirst && "rounded-l-full",
              isLast && "rounded-r-full"
            )}
            style={{
              transform: "translateZ(0)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
