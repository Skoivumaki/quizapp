"use client";
import React from "react";

interface InfoTileProps {
  id: string;
  value: string;
  infoMap?: Record<string, string>;
}
export function InfoTile({ id, value, infoMap }: InfoTileProps) {
  // Test messages. Should be moved to its own file.
  const defaultMessages: Record<string, string> = {
    beginning: "Starts playback from the very beginning of each track.",
    chorus: "Starts the track's near main chorus or hook.",
    nearend: "Only plays the last 30 seconds of each track.",
    random: "Chooses a random playback position in each track.",
    default: "Select a playback starting point for your game.",
  };

  const message =
    infoMap?.[value] || defaultMessages[value] || defaultMessages.default;

  return (
    <div id={`info-${id}`} className="text-sm text-gray-400 rounded p-1">
      {message}
    </div>
  );
}
