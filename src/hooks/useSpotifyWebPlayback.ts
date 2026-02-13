"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

export interface SpotifyPlayer {
  activateElement?: () => Promise<void> | void;
  addListener: (event: string, callback: (data: any) => void) => void;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void> | void;
}

interface UseSpotifyWebPlaybackOptions {
  enabled: boolean;
}

export function useSpotifyWebPlayback({
  enabled,
}: UseSpotifyWebPlaybackOptions) {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<SpotifyPlayer | null>(null);

  const createPlayer = useCallback(() => {
    if (!window.Spotify) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: "QuizApp Internal Player",
      getOAuthToken: async (cb: (token: string) => void) => {
        try {
          const res = await fetch("/quiz/api/spotify/refresh", {
            method: "POST",
          });
          const data = await res.json();
          cb(data.access_token);
        } catch (err) {
          toast.error("Spotify token refresh failed");
        }
      },
      volume: 0.8,
    });

    spotifyPlayer.addListener("ready", ({ device_id }: any) => {
      console.log("✅ Spotify ready:", device_id);
      setDeviceId(device_id);
    });

    spotifyPlayer.addListener("not_ready", async ({ device_id }: any) => {
      console.warn("⚠️ Device offline:", device_id);
      setDeviceId(null);
    });

    spotifyPlayer.addListener("initialization_error", (e: any) => {
      toast.error(`Spotify init error: ${e.message || e}`);
    });

    spotifyPlayer.addListener("authentication_error", (e: any) => {
      toast.error(`Spotify auth error: ${e.message || e}`);
    });

    spotifyPlayer.addListener("account_error", (e: any) => {
      toast.error(`Spotify account error: ${e.message || e}`);
    });

    playerRef.current = spotifyPlayer;
    setPlayer(spotifyPlayer);
  }, []);

  const recreatePlayer = useCallback(async () => {
    console.log("🔄 Recreating Spotify player...");

    try {
      await playerRef.current?.disconnect?.();
    } catch {}

    setPlayer(null);
    setDeviceId(null);

    createPlayer();
  }, [createPlayer]);

  useEffect(() => {
    if (!enabled) return;

    const existingScript = document.getElementById("spotify-player-sdk");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "spotify-player-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    if (window.Spotify) {
      createPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        createPlayer();
      };
    }

    return () => {
      playerRef.current?.disconnect?.();
    };
  }, [enabled, createPlayer]);

  return {
    player,
    deviceId,
    recreatePlayer,
  };
}
