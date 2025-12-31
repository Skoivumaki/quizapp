"use client";
import { useEffect, useState } from "react";

interface Player {
  name: string;
  points: number;
}

interface ScoreboardProps {
  canScore: boolean;
  onConsumeScore: () => void;
  onToggleVisibility: () => void;
  isVisible?: boolean;
}

export default function Scoreboard({
  canScore,
  onConsumeScore,
  onToggleVisibility,
  isVisible,
}: ScoreboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [roundClaimed, setRoundClaimed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chosenPlayer, setChosenPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("scoreboard");
      if (stored) setPlayers(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load scoreboard:", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("scoreboard", JSON.stringify(players));
    } catch (e) {
      console.error("Failed to save scoreboard:", e);
    }
  }, [players, loaded]);

  useEffect(() => {
    if (canScore) {
      setRoundClaimed(false);
      setChosenPlayer(null);
    }
  }, [canScore]);

  const addPlayer = () => {
    const trimmed = newPlayer.trim();
    if (!trimmed) return;
    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewPlayer("");
      return;
    }
    setPlayers([...players, { name: trimmed, points: 0 }]);
    setNewPlayer("");
  };

  const incrementScore = (name: string) => {
    if (!canScore || roundClaimed) return;
    setPlayers((prev) =>
      prev.map((p) => (p.name === name ? { ...p, points: p.points + 1 } : p))
    );
    setRoundClaimed(true);
    setChosenPlayer(name);
    onConsumeScore();
  };

  const resetScoreboard = () => {
    if (window.confirm("Reset all participants and scores?")) {
      localStorage.removeItem("scoreboard");
      setPlayers([]);
    }
  };

  const clearScores = () => {
    if (players.length === 0) return;
    if (window.confirm("Set all scores to 0 but keep player names?")) {
      setPlayers((prev) => prev.map((p) => ({ ...p, points: 0 })));
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4 text-white w-[90%] min-w-[340px]">
      <div className="w-full flex justify-between items-center mb-2 text-center">
        <h3 className="m-0 text-lg font-semibold w-full text-left">
          Scoreboard
        </h3>
        <button
          onClick={onToggleVisibility}
          title={isVisible ? "Hide Scoreboard" : "Show Scoreboard"}
          className="text-gray-400 text-sm hover:text-white transition-colors w-full text-center"
        >
          Hide
        </button>
        <button
          onClick={() => setShowSettings((s) => !s)}
          title="Settings"
          className="text-green-400 text-xl hover:text-green-300 transition-colors w-full text-right"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="flex flex-col items-center bg-gray-700 p-3 rounded-md w-full mb-3 gap-2 transition">
          <div className="flex gap-2 w-full justify-center">
            <input
              type="text"
              placeholder="Add participant"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              className="flex-1 px-2 py-1 rounded border border-gray-800 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={addPlayer}
              className="bg-green-500 text-black font-semibold rounded px-3 py-1 hover:bg-green-400 transition"
            >
              Add
            </button>
          </div>

          <button
            onClick={resetScoreboard}
            className="bg-red-500 text-white font-semibold rounded px-3 py-1 w-full hover:bg-red-400 transition"
          >
            Reset Scoreboard
          </button>

          <button
            onClick={clearScores}
            className="bg-yellow-400 text-black font-semibold rounded px-3 py-1 w-full hover:bg-yellow-300 transition"
          >
            Clear Scores
          </button>
        </div>
      )}

      {players.length === 0 ? (
        <p className="text-gray-400">No participants yet.</p>
      ) : (
        <ul className="list-none w-full p-0 flex flex-col gap-2">
          {players.map((p) => (
            <li
              key={p.name}
              onClick={() => incrementScore(p.name)}
              className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer font-medium transition ${
                chosenPlayer === p.name
                  ? "bg-purple-400 text-black"
                  : "bg-gray-700 text-white"
              } ${
                canScore && !roundClaimed
                  ? "hover:bg-neutral-600"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <span>{p.name}</span>
              <span className="text-pink-400 font-bold text-shadow-xs text-shadow-gray-700">
                {p.points}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-purple-400 mt-4 text-center">
        {canScore
          ? roundClaimed
            ? "Point awarded this round"
            : "(Click a name to add a point)"
          : "Waiting for next answer…"}
      </p>
    </div>
  );
}
