"use client";
import React, { useState } from "react";

interface InfoHeaderProps {
  label: string;
  onToggle?: (label: string, infoShow: boolean) => void;

  value?: boolean;
}

export function InfoHeader({ label, onToggle, value }: InfoHeaderProps) {
  const [localShowInfo, setLocalShowInfo] = useState(false);

  const infoShow = typeof value === "boolean" ? value : localShowInfo;

  const handleToggle = () => {
    const next = !infoShow;
    if (typeof value !== "boolean") setLocalShowInfo(next);
    if (onToggle) onToggle(label, next);
  };

  return (
    <div className="flex items-center justify-left w-full">
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        onClick={handleToggle}
        className={`px-2 py-1 text-xs transition-colors ${infoShow ? "" : ""}`}
      >
        {infoShow ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 24 24"
            fill="oklch(71.4% 0.203 305.504)"
            className="w-5 h-5"
          >
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
