"use client";

import { ButtonHTMLAttributes, forwardRef, LegacyRef, memo } from "react";

export enum ButtonTheme {
  PRIMARY = "primary",
  PRIMARY2 = "primary2",
  CLEAR = "clear",
  INVERT = "outline",
}

export enum ButtonSize {
  M = "m",
  L = "l",
  XL = "xl",
  XXL = "xxl",
  XXXL = "xxxl",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
  size?: ButtonSize;
  disabled?: boolean;
  ref?: LegacyRef<HTMLButtonElement>;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        theme = ButtonTheme.PRIMARY,
        size = ButtonSize.M,
        disabled = false,
        ...otherProps
      },
      ref
    ) => {
      const base =
        "inline-flex items-center justify-center font-semibold rounded-4xl transition-all duration-200 ease-out active:scale-95 focus:scale-102";

      const themeClasses = {
        [ButtonTheme.PRIMARY2]:
          "bg-gradient-to-bl from-indigo-400 via-purple-400 via-30% to-pink-400 to-90%",
        [ButtonTheme.PRIMARY]:
          "bg-green-500 border-2 border-green-500 text-black focus:bg-black focus:text-green-500",
        [ButtonTheme.CLEAR]:
          "bg-green-500/0 border-2 border-green-500 text-green-500 focus:text-white focus:ring-2 focus:ring-green-500",
        [ButtonTheme.INVERT]:
          "bg-black border-2 border-green-500 text-green-500 focus:bg-green-500 focus:text-black",
      }[theme];

      const sizeClasses = {
        [ButtonSize.M]: "text-sm px-3 py-1.5",
        [ButtonSize.L]: "text-base px-4 py-2",
        [ButtonSize.XL]: "text-lg px-5 py-2.5",
        [ButtonSize.XXL]: "text-xl px-6 py-3",
        [ButtonSize.XXXL]: "text-2xl px-8 py-3.5",
      }[size];

      const disabledClasses = disabled
        ? "opacity-60 cursor-not-allowed active:scale-100 focus:scale-100"
        : "cursor-pointer";

      return (
        <button
          ref={ref}
          type="button"
          className={`${base} ${themeClasses} ${sizeClasses} ${disabledClasses}`}
          disabled={disabled}
          {...otherProps}
        >
          {children}
        </button>
      );
    }
  )
);

Button.displayName = "Button";
