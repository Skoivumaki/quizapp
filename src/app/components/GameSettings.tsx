"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { SwitchBox } from "./SwitchBox";
import { Button, ButtonSize, ButtonTheme } from "./Button";
import { InfoTile } from "./InfoText";
import { InfoHeader } from "./InfoHeader";

interface GameSettingsProps {
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  seek: number;
  setSeek: Dispatch<SetStateAction<number>>;
  setLength: Dispatch<SetStateAction<number>>;
  length: number;
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
  setLength,
  length,
  random: randomSeek,
  setRandom: setRandomSeek,
  internalPlayer,
  setInternalPlayer,
}: GameSettingsProps) {
  const [songStart, setSongStart] = useState<
    "beginning" | "chorus" | "nearend" | "random"
  >("beginning");

  const [showSongStartInfo, setShowSongStartInfo] = useState(false);
  const [showGameLengthInfo, setShowGameLengthInfo] = useState(false);
  const [showSongLengthInfo, setshowSongLengthInfo] = useState(false);
  const [showInternalPlayerInfo, setShowInternalPlayerInfo] = useState(false);

  // Remove when tested
  const toggleRandomSeek = () => {
    setRandomSeek((prev) => !prev);
  };

  const toggleInternalPlayer = () => {
    setInternalPlayer((prev) => !prev);
  };

  // This is terrible
  const handleToggleInfo = (section: string, visible: boolean) => {
    if (section === "Song Start") setShowSongStartInfo(visible);
    if (section === "Game Length") setShowGameLengthInfo(visible);
    if (section === "Song Length") setshowSongLengthInfo(visible);
    if (section === "Use Internal Player") setShowInternalPlayerInfo(visible);
  };

  return (
    <div className="bg-gray-800 text-white max-w-md w-full">
      <div className="flex flex-col gap-4 w-full">
        <label className="flex flex-col gap-2">
          <InfoHeader
            label="Game Length"
            value={showGameLengthInfo}
            onToggle={handleToggleInfo}
          />
          {showGameLengthInfo && (
            <InfoTile
              id="gameLength"
              infoMap={{ 1: "How long should the game be. (estimated)" }}
              value="1"
            />
          )}
          <SwitchBox
            theme={ButtonTheme.PRIMARY}
            options={[
              { label: "5min", value: 10 },
              { label: "10min", value: 20 },
              { label: "30min", value: 45 },
            ]}
            onChange={(value) => setLimit(Number(value))}
          />

          <label className="flex flex-row items-center gap-2">
            <span>Custom Length</span>
            <input
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-20 p-1 rounded border border-gray-600 bg-gray-900 text-white focus:border-blue-500 focus:outline-none"
            />
            <Button
              theme={ButtonTheme.PRIMARY}
              size={ButtonSize.M}
              onClick={(e) => setLimit(100)}
            >
              Max
            </Button>
          </label>
        </label>
        <label className="flex flex-col gap-2">
          <InfoHeader
            label="Song Length"
            value={showSongLengthInfo}
            onToggle={handleToggleInfo}
          />
          {showSongLengthInfo && (
            // Needs info for all states
            <InfoTile
              id="trackLength"
              infoMap={{ 1: "How long should the song be played for?" }}
              value="1"
            />
          )}
          <SwitchBox
            theme={ButtonTheme.PRIMARY}
            options={[
              { label: "10s", value: 10000 },
              { label: "30s", value: 30000 },
              { label: "1m", value: 60000 },
              { label: "Full", value: 600000 },
            ]}
            onChange={(value) => setLength(Number(value))}
          />

          <label className="flex flex-row items-center gap-2">
            <span>Custom Track Length</span>
            <input
              type="number"
              min={1}
              max={600000}
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
              className="w-20 p-1 rounded border border-gray-600 bg-gray-900 text-white focus:border-blue-500 focus:outline-none"
            />
          </label>
        </label>
        <label className="flex flex-col gap-2">
          <InfoHeader
            label="Song Start"
            value={showSongStartInfo}
            onToggle={handleToggleInfo}
          />
          {showSongStartInfo && <InfoTile id="songStart" value={songStart} />}
          <SwitchBox
            theme={ButtonTheme.PRIMARY}
            options={[
              { label: "Beginning", value: "beginning" },
              { label: "Chorus", value: "chorus" },
              { label: "End", value: "nearend" },
              { label: "Random", value: "random" },
            ]}
            onChange={(value) => {
              setSongStart(value as any);
              setRandomSeek(value === "random");
            }}
          />
        </label>
        {/* <label className="flex items-center gap-2">
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
        </label> */}
        <label className="flex flex-col gap-2">
          <InfoHeader
            label="Audio Playback"
            value={showInternalPlayerInfo}
            onToggle={handleToggleInfo}
          />
          {showInternalPlayerInfo && (
            // Needs info for all states
            <InfoTile
              id="internalPlayer"
              infoMap={{
                1: "Internal: Songs play in browser. External: Songs will play on your chosen Spotify device or the one active.",
              }}
              value="1"
            />
          )}
          <SwitchBox
            theme={ButtonTheme.PRIMARY}
            options={[
              { label: "Internal", value: "true" },
              { label: "External", value: "false" },
            ]}
            onChange={(value) => setInternalPlayer(value === "true")}
          />
        </label>
      </div>
    </div>
  );
}
