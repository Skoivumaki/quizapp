"use client";

import React, { useRef, useEffect } from "react";
import clsx from "clsx";

type Gamemode = "classic" | "duo";

const MODES: { id: Gamemode; title: string; desc: string }[] = [
  { id: "classic", title: "Classic", desc: "Solo quiz experience" },
  { id: "duo", title: "Duo", desc: "Play together with a friend" },
  { id: "classic", title: "More to come", desc: "Check back later!" },
];

export default function GamemodeSelector({
  value,
  onChange,
}: {
  value: Gamemode;
  onChange: (mode: Gamemode) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoSnapping = useRef(false);

  const activeIndex = MODES.findIndex((m) => m.id === value);

  useEffect(() => {
    if (!containerRef.current || activeIndex < 0) return;

    const container = containerRef.current;
    const width = container.offsetWidth;

    const itemWidth = width * 0.8;
    const sidePadding = width * 0.1;

    const scrollLeft = activeIndex * itemWidth - sidePadding;

    autoSnapping.current = true;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });

    const t = setTimeout(() => {
      autoSnapping.current = false;
    }, 300);

    return () => clearTimeout(t);
  }, [activeIndex]);

  return (
    <div className="w-screen">
      <h2 className="text-center text-sm font-semibold text-white mb-2">
        Choose Game Mode
      </h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/60 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/60 to-transparent z-20" />

        <div
          ref={containerRef}
          className="flex overflow-x-scroll snap-x snap-mandatory no-scrollbar px-[10%]"
        >
          {MODES.map((mode, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={mode.id}
                className={clsx(
                  "snap-center min-w-[80%] px-3 py-4 flex justify-center",
                  index === 0 && "ml-[20%]",
                  index === MODES.length - 1 && "mr-[20%]"
                )}
              >
                <button
                  type="button"
                  onClick={() => onChange(mode.id)}
                  className={clsx(
                    "relative w-full rounded-xl p-6 transition-all duration-300",
                    "bg-gray-800 text-white",
                    isActive
                      ? "scale-100 z-20 shadow-xl border border-purple-400"
                      : "scale-90 opacity-60 z-10"
                  )}
                >
                  <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                  <p className="text-sm text-gray-400">{mode.desc}</p>

                  {isActive && (
                    <span className="absolute top-2 right-2 text-xs bg-pink-400 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {MODES.map((_, i) => (
          <div
            key={i}
            className={clsx(
              "h-2 w-2 rounded-full transition",
              i === activeIndex ? "bg-purple-500" : "bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  );
}
