import React from "react";
import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  wrap?: boolean;
  gap?: string;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  direction = "row",
  justify = "start",
  align = "center",
  wrap = false,
  gap = "0",
  className,
}) => {
  return (
    <div
      className={clsx(
        "relative flex overflow-hidden bg-gray-800",
        direction === "col" ? "flex-col" : "flex-row",
        wrap && "flex-wrap",
        `justify-${justify}`,
        `items-${align}`,
        gap !== "0" && `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
};
