"use client";

import { useParams, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

namespace Spotify {
  export interface Player {
    addListener: (event: string, callback: (data: unknown) => void) => void;
    connect: () => void;
  }
}

import { useAccessToken } from "../../providers";
import { useGetPlaylistQuery } from "@/quizApi";
import { useFormattedTracks } from "@/hooks/useFormatTracks";
import UserProfile from "@/app/components/UserProfile";
import GuessingGame from "@/app/components/GuessingGame";
import { useEffect, useState } from "react";
import Scoreboard from "@/app/components/Scoreboard";
import Link from "next/link";

export default function PlayPage() {
  const accessToken = useAccessToken();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const limitParam = Number(searchParams.get("limit")) || 20;
  const seekParam = Number(searchParams.get("seek")) || 0;
  const isRandom = searchParams.get("random") === "true";
  const internalPlayer = searchParams.get("internalPlayer") === "true";

  const { data, isLoading } = useGetPlaylistQuery(id as string);
  const formattedTracks = useFormattedTracks(data?.tracks.items, {
    shuffle: true,
    limit: limitParam,
  });

  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState("idle");
  const [canScore, setCanScore] = useState(false);

  useEffect(() => {
    if (!internalPlayer || !accessToken || typeof window === "undefined")
      return;
    if (spotifyPlayer) return;

    const existing = document.getElementById("spotify-player-sdk");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "spotify-player-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "QuizApp Internal Player",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.8,
      });

      setSpotifyPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("✅ Spotify Player ready with Device ID:", device_id);
        setSpotifyDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.warn("⚠️ Spotify Player not ready:", device_id);
      });

      player.connect();
    };
  }, [internalPlayer, accessToken, spotifyPlayer]);

  useEffect(() => {
    if (gameStatus === "answer_shown") setCanScore(true);
    else setCanScore(false);
  }, [gameStatus]);

  const handleConsumeScore = () => setCanScore(false);
  const isScoreboardVisible =
    gameStatus === "answer_shown" || gameStatus === "finished";
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  if (isLoading) return <p>Loading playlist...</p>;

  return (
    <div
      style={{
        color: "white",
        padding: "1rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button onClick={() => setShowDebugInfo((prev) => !prev)}>
        Toggle Debug Info
      </button>
      {showDebugInfo && (
        <>
          {internalPlayer && (
            <div className="mb-2 text-green-400">
              Internal Spotify Player Enabled{" "}
              {spotifyDeviceId
                ? `(Device: ${spotifyDeviceId})`
                : "(initializing…)"}
            </div>
          )}

          <UserProfile />
          <p>
            Playlist loaded with <strong>{formattedTracks.length}</strong>{" "}
            tracks. Limit: <strong>{limitParam}</strong> | Seek Start:{" "}
            <strong>{seekParam}ms </strong> | Status: {gameStatus}
          </p>
        </>
      )}
      <GuessingGame
        tracks={formattedTracks}
        playlistName={data?.name}
        accessToken={accessToken}
        onStatusChange={setGameStatus}
        seek={seekParam}
        random={isRandom}
        deviceId={spotifyDeviceId}
      />

      {isScoreboardVisible && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Scoreboard canScore={canScore} onConsumeScore={handleConsumeScore} />

          {gameStatus === "finished" && (
            <Link
              href="/play"
              style={{
                marginTop: "1rem",
                background: "#1ed760",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1.2rem",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Play Again
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
