"use client";
import { Dispatch, SetStateAction, useState } from "react";

interface GameSettingsProps {
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  seek: number;
  setSeek: Dispatch<SetStateAction<number>>;
  random?: boolean;
  setRandom: Dispatch<SetStateAction<boolean>>;
  internalPlayer: boolean;
  setInternalPlayer: Dispatch<SetStateAction<boolean>>;
}

export default function GameSettings({
  limit,
  setLimit,
  seek,
  setSeek,
  random: randomSeek,
  setRandom: setRandomSeek,
  internalPlayer,
  setInternalPlayer,
}: GameSettingsProps) {
  const toggleRandomSeek = () => {
    setRandomSeek((prev) => !prev);
  };

  const toggleInternalPlayer = () => {
    setInternalPlayer((prev) => !prev);
  };

  return (
    <div className="bg-gray-800 p-4 rounded border border-gray-700 text-white max-w-md">
      <h2 className="text-lg font-semibold mb-3">Game Settings</h2>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <span>Limit:</span>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-20 p-1 rounded border border-gray-600 bg-gray-900 text-white focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Seek (ms):</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={seek}
            onChange={(e) => setSeek(Number(e.target.value))}
            disabled={randomSeek}
            className={`w-24 p-1 rounded border border-gray-600 bg-gray-900 text-white focus:border-blue-500 focus:outline-none ${
              randomSeek ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Random track start:</span>
          <button
            type="button"
            onClick={toggleRandomSeek}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              randomSeek
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {randomSeek ? "Random: ON" : "Random: OFF"}
          </button>
        </label>
        <label className="flex flex-col gap-2">
          <span>Use Internal Player:</span>
          <button
            type="button"
            onClick={toggleInternalPlayer}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              internalPlayer
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {internalPlayer ? "Internal: ON" : "Internal: OFF"}
          </button>
          <small>
            This setting controls whether the device game is played on is used
            for playback.
          </small>
        </label>
      </div>
    </div>
  );
}
