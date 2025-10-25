"use client";
import { useEffect, useState } from "react";

interface Player {
  name: string;
  points: number;
}

interface ScoreboardProps {
  canScore: boolean;
  onConsumeScore: () => void;
}

export default function Scoreboard({
  canScore,
  onConsumeScore,
}: ScoreboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [roundClaimed, setRoundClaimed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    if (canScore) setRoundClaimed(false);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#1e1e1e",
        borderRadius: "8px",
        padding: "1rem",
        color: "white",
        width: "320px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Scoreboard</h3>
        <button
          onClick={() => setShowSettings((s) => !s)}
          title="Settings"
          style={{
            background: "transparent",
            border: "none",
            color: "#1ed760",
            cursor: "pointer",
            fontSize: "1.3rem",
            padding: "0.2rem",
          }}
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#2a2a2a",
            padding: "0.75rem",
            borderRadius: "6px",
            width: "100%",
            marginBottom: "0.75rem",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <input
              type="text"
              placeholder="Add participant"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              style={{
                flex: 1,
                padding: "0.4rem",
                borderRadius: "4px",
                border: "1px solid #555",
                background: "#2f2f2f",
                color: "white",
              }}
            />
            <button
              onClick={addPlayer}
              style={{
                background: "#1ed760",
                color: "black",
                border: "none",
                borderRadius: "4px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Add
            </button>
          </div>

          <button
            onClick={resetScoreboard}
            style={{
              background: "#ff5555",
              border: "none",
              borderRadius: "4px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
              fontWeight: 600,
              color: "white",
              width: "100%",
              marginTop: "0.5rem",
            }}
          >
            Reset Scoreboard
          </button>

          <button
            onClick={clearScores}
            style={{
              background: "#ffcc00",
              border: "none",
              borderRadius: "4px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
              fontWeight: 600,
              color: "black",
              width: "100%",
            }}
          >
            Clear Scores
          </button>
        </div>
      )}

      {players.length === 0 ? (
        <p>No participants yet.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            width: "100%",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {players.map((p) => (
            <li
              key={p.name}
              onClick={() => incrementScore(p.name)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#2f2f2f",
                padding: "0.5rem 0.8rem",
                borderRadius: "6px",
                cursor: canScore && !roundClaimed ? "pointer" : "not-allowed",
                opacity: canScore && !roundClaimed ? 1 : 0.6,
              }}
            >
              <span>{p.name}</span>
              <span style={{ color: "#1ed760", fontWeight: "bold" }}>
                {p.points}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p
        style={{
          fontSize: "0.8rem",
          color: "#aaa",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        {canScore
          ? roundClaimed
            ? "Point awarded this round"
            : "(Click a name to add a point)"
          : "Waiting for next answer…"}
      </p>
    </div>
  );
}
