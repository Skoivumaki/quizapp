"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useAccessToken } from "../../providers";
import { useGetPlaylistQuery } from "@/quizApi";
import { useFormattedTracks } from "@/hooks/useFormatTracks";
import UserProfile from "@/app/components/UserProfile";
import GuessingGame from "@/app/components/GuessingGame";
import { useEffect, useState } from "react";
import Scoreboard from "@/app/components/Scoreboard";
import Link from "next/link";
import { Button, ButtonSize, ButtonTheme } from "@/app/components/Button";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

export interface SpotifyPlayer {
  addListener: (event: string, callback: (data: unknown) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

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
  const [spotifyPlayer, setSpotifyPlayer] = useState<SpotifyPlayer | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (spotifyPlayer) spotifyPlayer.disconnect();
    };
  }, [spotifyPlayer]);

  const [gameStatus, setGameStatus] = useState("loading");
  const [canScore, setCanScore] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(true);

  useEffect(() => {
    if (!accessToken || !internalPlayer) return;
    if (spotifyPlayer) return;

    const script = document.getElementById("spotify-player-sdk");
    if (!script) {
      const el = document.createElement("script");
      el.id = "spotify-player-sdk";
      el.src = "https://sdk.scdn.co/spotify-player.js";
      el.async = true;
      document.body.appendChild(el);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "QuizApp Internal Player",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.8,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID:", device_id);
        setSpotifyDeviceId(device_id);
      });

      setSpotifyPlayer(player);
    };
  }, [accessToken, internalPlayer, spotifyPlayer]);

  useEffect(() => {
    if (gameStatus === "answer_shown") setCanScore(true);
    else setCanScore(false);
  }, [gameStatus]);

  const handleConsumeScore = () => setCanScore(false);
  const isScoreboardVisible =
    gameStatus === "answer_shown" || gameStatus === "finished";
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleStartPlayback = async () => {
    if (!spotifyPlayer) return;

    const connected = await spotifyPlayer.connect();
    console.log("connect() returned:", connected);
  };

  if (isLoading) return <p>Loading playlist...</p>;

  return (
    <>
      <div
        style={{
          color: "white",
          padding: "1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "clip",
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
              {isScoreboardVisible && <span> | Scoreboard: Visible</span>}
              {showScoreboard && <span> | Scoreboard: Shown </span>}
              {accessToken}
            </p>
          </>
        )}
        {spotifyPlayer && !spotifyDeviceId ? (
          <Button
            theme={ButtonTheme.PRIMARY}
            size={ButtonSize.L}
            onClick={handleStartPlayback}
          >
            Connect Spotify Player
          </Button>
        ) : (
          <GuessingGame
            tracks={formattedTracks}
            playlistName={data?.name}
            accessToken={accessToken}
            onStatusChange={setGameStatus}
            seek={seekParam}
            random={isRandom}
            deviceId={spotifyDeviceId}
          />
        )}
      </div>
      {!isScoreboardVisible && (
        <button
          onClick={() => setShowScoreboard((prev) => !prev)}
          title={showScoreboard ? "Hide Scoreboard" : "Show Scoreboard"}
          className="text-gray-400 text-sm hover:text-white transition-colors w-full text-center p-2 bottom-0 fixed bg-neutral-900 rounded-lg"
        >
          Show Scoreboard
        </button>
      )}
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-300 ease-in-out w-full fixed bottom-0 mb-2 overflow-hidden ${
          isScoreboardVisible || showScoreboard
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-100"
        }`}
      >
        <Scoreboard
          canScore={canScore}
          onConsumeScore={handleConsumeScore}
          isVisible={isScoreboardVisible}
          onToggleVisibility={() => setShowScoreboard((v) => !v)}
        />

        {/* <Link
          href="/play"
          className={`mt-4 bg-[#1ed760] text-black rounded-md px-4 py-2 font-semibold hover:bg-[#21f36a] transition-colors ${
            gameStatus === "finished"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          Play Again
        </Link> */}
      </div>
    </>
  );
}
