import { useState } from "react";
import { InfoHeader } from "./InfoHeader";
import { InfoTile } from "./InfoText";
import clsx from "clsx";
import { TickToggle } from "./TickToggle";
import { useDispatch, useSelector } from "react-redux";
import {
  setAutoShowScoreboard,
  setUseInternalPlayer,
  setShowAddedByInfo,
} from "@/settingsSlice";
import { RootState } from "@/store";

interface NavSettingsProps {
  showSettings: boolean;
}

export default function NavSettings({ showSettings }: NavSettingsProps) {
  const [showInternalPlayerInfo, setShowInternalPlayerInfo] = useState(false);
  const [showAutoShowScoreboardInfo, setShowAutoShowScoreboardInfo] =
    useState(false);
  const [showAddedByInfoInfo, setShowAddedByInfoInfo] = useState(false);

  const handleToggleInfo = (section: string, visible: boolean) => {
    if (section === "Use Internal Player") setShowInternalPlayerInfo(visible);
    if (section === "Auto open Scoreboard")
      setShowAutoShowScoreboardInfo(visible);
    if (section === "Show added‑by info") setShowAddedByInfoInfo(visible);
  };

  const dispatch = useDispatch();

  const { autoShowScoreboard, useInternalPlayer, showAddedByInfo } =
    useSelector((state: RootState) => state.settings);

  return (
    <div
      className={clsx(
        "fixed w-full h-fit top-10 bg-gray-950/90 justify-center z-5 items-center p-4 transition-transform duration-300 border-y-1 border-purple-400",
        showSettings
          ? "transform translate-y-0"
          : "transform -translate-y-full",
      )}
    >
      <h1 className="text-center font-bold text-2xl mb-4">Settings</h1>
      <div className="gap-4 flex flex-col">
        {/* <label className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <InfoHeader
              label="Use Internal Player"
              value={showInternalPlayerInfo}
              onToggle={handleToggleInfo}
            />
            <TickToggle
              checked={useInternalPlayer}
              onChange={() =>
                dispatch(setUseInternalPlayer(!useInternalPlayer))
              }
            />
          </div>
          {showInternalPlayerInfo && (
            <InfoTile
              id="gameLength"
              infoMap={{ 1: "Use the external Spotify player." }}
              value="1"
            />
          )}
        </label> */}
        <label className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <InfoHeader
              label="Auto open Scoreboard"
              value={showAutoShowScoreboardInfo}
              onToggle={handleToggleInfo}
            />
            <TickToggle
              checked={autoShowScoreboard}
              onChange={() =>
                dispatch(setAutoShowScoreboard(!autoShowScoreboard))
              }
            />
          </div>
          {showAutoShowScoreboardInfo && (
            <InfoTile
              id="gameLength"
              infoMap={{
                1: "Should the scoreboard open automatically when answer is shown.",
              }}
              value="1"
            />
          )}
        </label>
        <label className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <InfoHeader
              label="Show added‑by info"
              value={showAddedByInfoInfo}
              onToggle={handleToggleInfo}
            />
            <TickToggle
              checked={showAddedByInfo}
              onChange={() => dispatch(setShowAddedByInfo(!showAddedByInfo))}
            />
          </div>
          {showAddedByInfoInfo && (
            <InfoTile
              id="gameLength"
              infoMap={{
                1: "Display the name and profile picture of the person who added each song.",
              }}
              value="1"
            />
          )}
        </label>
      </div>
    </div>
  );
}
