"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccessToken } from "../../providers";
import { useGetPlaylistQuery } from "@/spotifyApi";
import { useFormattedTracks } from "@/hooks/useFormatTracks";
import { useMixedPlaylists } from "@/hooks/useMixedPlaylists";
import GuessingGame from "@/app/components/GuessingGame";
import Scoreboard from "@/app/components/Scoreboard";
import { Button, ButtonSize, ButtonTheme } from "@/app/components/Button";
import NavBar from "@/app/components/NavBar";
import Image from "next/image";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

export interface SpotifyPlayer {
  activateElement?: () => Promise<void> | void;
  addListener: (event: string, callback: (data: unknown) => void) => void;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void> | void;
}

export default function PlayPage() {
  const accessToken = useAccessToken();
  const { id } = useParams();

  const searchParams = useSearchParams();
  const limitParam = Number(searchParams.get("limit")) || 20;
  const seekParam = Number(searchParams.get("seek")) || 0;
  const gamemodeParam = Number(searchParams.get("gm")) || "classic";
  const selectedPlaylistId2 = searchParams.get("playlist2");
  const isRandom = searchParams.get("random") === "true";
  const internalPlayer = searchParams.get("internalPlayer") === "true";

  const singlePlaylistQuery = useGetPlaylistQuery(id as string, {
    skip: !!selectedPlaylistId2,
  });

  const mixedPlaylistQuery = useMixedPlaylists(
    id as string,
    selectedPlaylistId2,
    { shuffle: true, limit: limitParam },
  );

  const isUsingMixed = !!selectedPlaylistId2;
  const isLoading = isUsingMixed
    ? mixedPlaylistQuery.isLoading
    : singlePlaylistQuery.isLoading;

  const formattedTracks = isUsingMixed
    ? mixedPlaylistQuery.tracks
    : useFormattedTracks(singlePlaylistQuery.data?.tracks.items, {
        shuffle: true,
        limit: limitParam,
      });

  const data = isUsingMixed ? { name: "Duo Mode" } : singlePlaylistQuery.data;

  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<SpotifyPlayer | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (spotifyPlayer) spotifyPlayer.disconnect?.();
    };
  }, [spotifyPlayer]);

  useEffect(() => {
    if (!accessToken || !internalPlayer || spotifyPlayer) return;

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
        getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
        volume: 0.8,
      });

      player.addListener("ready", ({ device_id }: any) => {
        setSpotifyDeviceId(device_id);
        console.log(`Spotify player ready (${device_id})`);
      });
      player.addListener("not_ready", ({ device_id }: any) => {
        console.warn("not_ready:", device_id);
        toast.warning(`Spotify player not ready (${device_id})`);
      });
      player.addListener("initialization_error", (e: any) => {
        console.error("Initialization error", e);
        toast.error(`Spotify init error: ${e.message || e}`);
      });
      player.addListener("authentication_error", (e: any) => {
        console.error("Auth error", e);
        toast.error(`Spotify auth error: ${e.message || e}`);
      });
      player.addListener("account_error", (e: any) => {
        console.error("Account error", e);
        toast.error(`Spotify account error: ${e.message || e}`);
      });

      setSpotifyPlayer(player);
    };
  }, [accessToken, internalPlayer, spotifyPlayer]);

  const [gameStatus, setGameStatus] = useState("loading");
  const [canScore, setCanScore] = useState(false);
  const [trackImage, setTrackImage] = useState<string | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  // Move control into settings
  const [autoShowScoreboard, setAutoShowScoreboard] = useState(true);

  useEffect(() => {
    setCanScore(gameStatus === "answer_shown");
  }, [gameStatus]);

  const handleConsumeScore = () => setCanScore(false);

  const isScoreboardAllowed =
    gameStatus === "answer_shown" || gameStatus === "finished";

  const scoreboardVisible = isScoreboardAllowed && showScoreboard;

  useEffect(() => {
    if (!autoShowScoreboard) return;

    if (isScoreboardAllowed) {
      setShowScoreboard(true);
    }
  }, [isScoreboardAllowed, autoShowScoreboard]);

  const handleStartPlayback = async () => {
    if (!spotifyPlayer) {
      toast.error("Spotify Player not initialized yet!");
      return;
    }
    if (spotifyPlayer.activateElement) await spotifyPlayer.activateElement();

    try {
      const ok = await spotifyPlayer.connect();
      if (ok) console.log("Spotify player connecting…");
      else
        toast.error(
          "Spotify failed to initialize. Check account or permissions.",
        );
    } catch (err: any) {
      console.error("connect() error:", err);
      toast.error(`Connect error: ${err.message || err}`);
    }
  };

  const handleShowAnswer = (image: string | null) => {
    setTrackImage(image);
  };

  if (isLoading) return;
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
    ></div>
    <p>Loading playlist...</p>
  </>;

  return (
    <>
      <NavBar variant="game" />
      <div
        className="pt-10"
        style={{
          position: "relative",
          height: "80vh",
          maxHeight: "80vh",
          overflow: "clip",
          backgroundImage: `url(${trackImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(8px)",
        }}
      ></div>
      <div
        className="py-2 gap-2 mt-12"
        style={{
          position: "absolute",
          color: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          height: "90vh",
          maxHeight: "90vh",
          overflow: "clip",
          width: "100%",
          top: 0,
        }}
      >
        {/* <button onClick={() => setShowDebugInfo((prev) => !prev)}>
          Toggle Debug Info
        </button> */}
        {/* {showDebugInfo && (
          <>
            {internalPlayer && (
              <div className="mb-2 text-green-400">
                Internal Spotify Player Enabled{" "}
                {spotifyDeviceId
                  ? `(Device: ${spotifyDeviceId})`
                  : "(initializing…)"}
              </div>
            )}
            <p>
              Playlist loaded with <strong>{formattedTracks.length}</strong>{" "}
              tracks. Limit: <strong>{limitParam}</strong> | Seek Start:
              <strong>{seekParam}ms </strong> | Status: {gameStatus}
              {isScoreboardVisible && <span> | Scoreboard: Visible</span>}
              {showScoreboard && <span> | Scoreboard: Shown </span>}
            </p>
          </>
        )} */}

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
            gamemode={gamemodeParam}
            onShowAnswer={handleShowAnswer}
          />
        )}
      </div>

      {!scoreboardVisible && (
        <button
          onClick={() => setShowScoreboard((prev) => !prev)}
          title={showScoreboard ? "Hide Scoreboard" : "Show Scoreboard"}
          className="text-gray-400 text-sm hover:text-white transition-colors w-full text-center p-2 bottom-0 fixed bg-gray-800 rounded-lg"
        >
          Show Scoreboard
        </button>
      )}

      <div
        className={`flex flex-col items-center gap-4 transition-all duration-300 ease-in-out w-full fixed bottom-0 mb-2 overflow-hidden ${
          scoreboardVisible || showScoreboard
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-100"
        }`}
      >
        <Scoreboard
          canScore={canScore}
          onConsumeScore={handleConsumeScore}
          isVisible={scoreboardVisible}
          onToggleVisibility={() => setShowScoreboard((v) => !v)}
        />
      </div>
    </>
  );
}
