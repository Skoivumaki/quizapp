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
  const creatingRef = useRef(false); // Prevent duplicate player creation
  const sdkLoadedRef = useRef(false);

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/spotify/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Token refresh failed:", res.status);
        return null;
      }

      const data = await res.json();
      if (data.access_token) {
        console.log("✅ Token fetched successfully");
        return data.access_token;
      }

      return null;
    } catch (err) {
      console.error("Token fetch error:", err);
      return null;
    }
  }, []);

  const createPlayer = useCallback(async () => {
    // Prevent concurrent player creation
    if (creatingRef.current || playerRef.current) {
      console.log("Player already exists or creation in progress, skipping");
      return;
    }

    if (!window.Spotify) {
      console.warn("window.Spotify not available yet");
      return;
    }

    creatingRef.current = true;
    console.log("Creating Spotify player...");

    try {
      const spotifyPlayer = new window.Spotify.Player({
        name: "QuizApp Internal Player",
        getOAuthToken: async (cb: (token: string) => void) => {
          console.log("getOAuthToken callback triggered");
          try {
            const token = await getToken();
            if (token) {
              cb(token);
            } else {
              toast.error("Failed to fetch Spotify token");
              cb("");
            }
          } catch (err) {
            console.error("Token callback error:", err);
            toast.error("Token fetch error");
            cb("");
          }
        },
        volume: 0.8,
      });

      spotifyPlayer.addListener("ready", ({ device_id }: any) => {
        console.log("✅ Spotify player ready with device:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        console.warn("⚠️ Spotify device not ready:", device_id);
        setDeviceId(null);
      });

      spotifyPlayer.addListener("initialization_error", (e: any) => {
        console.error("Spotify initialization error:", e);
        toast.error(`Spotify error: ${e.message || "Init failed"}`);
      });

      spotifyPlayer.addListener("authentication_error", (e: any) => {
        console.error("Spotify authentication error:", e);
        toast.error(`Spotify auth error: ${e.message || "Auth failed"}`);
      });

      spotifyPlayer.addListener("account_error", (e: any) => {
        console.error("Spotify account error:", e);
        toast.error(`Spotify account error: ${e.message || "Account failed"}`);
      });

      spotifyPlayer.addListener("playback_error", (e: any) => {
        console.error("Spotify playback error:", e);
      });

      playerRef.current = spotifyPlayer;
      setPlayer(spotifyPlayer);

      // Connect with timeout
      console.log("Connecting player...");
      const connectPromise = spotifyPlayer.connect();
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Player connection timeout");
          resolve(false);
        }, 8000); // Increased timeout
      });

      const connected = await Promise.race([connectPromise, timeoutPromise]);

      if (!connected) {
        console.error("Player connection failed or timed out");
        toast.error("Failed to connect Spotify player");
        creatingRef.current = false;
        return;
      }

      console.log("✅ Player connected successfully");
    } catch (err) {
      console.error("Player creation error:", err);
      toast.error("Failed to create Spotify player");
    } finally {
      creatingRef.current = false;
    }
  }, [getToken]);

  const recreatePlayer = useCallback(async () => {
    console.log("🔄 Recreating Spotify player...");

    try {
      if (playerRef.current) {
        await playerRef.current?.disconnect?.();
      }
    } catch (err) {
      console.error("Disconnect error:", err);
    }

    playerRef.current = null;
    setPlayer(null);
    setDeviceId(null);
    creatingRef.current = false;

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Recreate
    await createPlayer();
  }, [createPlayer]);

  useEffect(() => {
    if (!enabled) {
      console.log("Spotify player disabled");
      return;
    }

    console.log("Setting up Spotify Web Playback SDK...");

    // Load SDK script only if not already loaded
    const existingScript = document.getElementById("spotify-player-sdk");

    if (!existingScript) {
      console.log("Loading Spotify SDK script...");
      const script = document.createElement("script");
      script.id = "spotify-player-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.onload = () => {
        console.log("Spotify SDK script loaded");
      };
      script.onerror = () => {
        console.error("Failed to load Spotify SDK script");
        toast.error("Failed to load Spotify SDK");
      };
      document.body.appendChild(script);
    } else {
      console.log("Spotify SDK script already loaded");
    }

    // Set up ready callback - only once
    if (!sdkLoadedRef.current) {
      if (window.Spotify) {
        console.log("window.Spotify already available");
        sdkLoadedRef.current = true;
        createPlayer();
      } else {
        console.log("Waiting for window.Spotify...");
        window.onSpotifyWebPlaybackSDKReady = () => {
          console.log("onSpotifyWebPlaybackSDKReady called");
          if (!sdkLoadedRef.current) {
            sdkLoadedRef.current = true;
            createPlayer();
          }
        };
      }
    }

    return () => {
      // Don't disconnect on unmount - player is reused
      // Only cleanup if hook is completely disabled
      if (!enabled && playerRef.current) {
        playerRef.current?.disconnect?.();
      }
    };
  }, [enabled, createPlayer]);

  return {
    player,
    deviceId,
    recreatePlayer,
  };
}
