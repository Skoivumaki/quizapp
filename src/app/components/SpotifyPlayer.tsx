"use client";
import { useEffect, useState } from "react";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
}

interface PlayerState {
  is_playing: boolean;
  item: Track | null;
  progress_ms: number;
}

export default function SpotifyPlayer({
  access_token,
}: {
  access_token: string;
}) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current player state
  const fetchState = async () => {
    try {
      const res = await fetch("/api/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "state", access_token: access_token }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!data) {
        setPlayerState(null);
        return;
      }

      setPlayerState(data);
    } catch (e) {
      console.error("Error fetching player state:", e);
    }
  };

  // Control playback
  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      await fetch("/api/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, access_token: access_token }),
      });
      await fetchState();
    } catch (e) {
      console.error("Action failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const [localProgress, setLocalProgress] = useState<number>(0);

  useEffect(() => {
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  useEffect(() => {
    if (playerState?.progress_ms != null) {
      setLocalProgress(playerState.progress_ms);
    }
  }, [playerState]);

  useEffect(() => {
    if (!playerState?.is_playing) return;
    const interval = setInterval(() => {
      setLocalProgress((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [playerState?.is_playing]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchState();
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  const track = playerState?.item;
  const trackProgress = track ? track.duration_ms || 0 : 0;

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
      {track ? (
        <>
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
            className="w-full rounded-xl"
          />
          <h2 className="text-lg font-semibold mt-3">{track.name}</h2>
          <p className="text-sm text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </p>

          <div>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(localProgress || 0).toISOString().substr(14, 5)} /{" "}
              {new Date(trackProgress).toISOString().substr(14, 5)}
            </p>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={() => handleAction("previous")}
              disabled={loading}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              ⏮
            </button>
            <button
              onClick={() =>
                handleAction(playerState?.is_playing ? "pause" : "play")
              }
              disabled={loading}
              className="px-3 py-2 rounded bg-green-600 hover:bg-green-500"
            >
              {playerState?.is_playing ? "⏸" : "▶️"}
            </button>
            <button
              onClick={() => handleAction("next")}
              disabled={loading}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              ⏭
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400">
          No active Spotify playback detected.
        </p>
      )}
    </div>
  );
}
