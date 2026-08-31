// components/GuessingGame.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  usePausePlaybackMutation,
  usePlayTrackMutation,
  useResumePlaybackMutation,
} from "@/spotifyApi";
import { toast } from "react-toastify";
import UserInfo from "./UserInfo";
import { Button } from "./Button";
import clsx from "clsx";
import Image from "next/image";
import playbutton from "@/shared/assets/icons/play.svg";
import pause from "@/shared/assets/icons/pause.svg";
import playagain from "@/shared/assets/icons/playagain.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGameState, type GameState } from "@/hooks/useGameState";

interface FormattedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  uri: string;
  duration_ms: number;
  added_by_id: string;
}

interface GuessingGameProps {
  playlistId: string;
  playlistId2?: string;
  playlistName?: string;
  tracks: FormattedTrack[];
  onStatusChange?: (status: string) => void;
  onShowAnswer?: (image: string | null) => void;
  seek?: number;
  random?: boolean;
  deviceId?: string | null;
  gamemode?: string | null;
  recreatePlayer?: () => void;
  resumedState?: GameState | null;
}

export default function GuessingGame({
  playlistId,
  playlistId2,
  playlistName,
  tracks,
  onStatusChange,
  onShowAnswer,
  seek = 0,
  random = false,
  deviceId,
  gamemode = "classic",
  resumedState,
}: GuessingGameProps) {
  // Initialize game state with either fresh state or resumed state
  const { gameState, updateGameState, isClient } = useGameState(
    resumedState || {
      playlistId,
      playlistId2,
      playlistName: playlistName || "",
      tracks,
      currentIndex: 0,
      seek,
      random,
      gamemode: gamemode || "classic",
    },
  );

  // Local UI state that doesn't need persistence
  const [isPaused, setIsPaused] = useState(false);
  const [isAnswerCoolingDown, setIsAnswerCoolingDown] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [hasResumedPlayback, setHasResumedPlayback] = useState(false);

  const [playTrack, { isLoading }] = usePlayTrackMutation();
  const [pausePlayback] = usePausePlaybackMutation();
  const [resumePlayback] = useResumePlaybackMutation();

  const showAddedByInfo = useSelector(
    (state: RootState) => state.settings.showAddedByInfo,
  );

  // Use persisted game state
  const currentIndex = gameState?.currentIndex ?? 0;
  const startPosition = gameState?.startPosition ?? 0;
  const hasStarted = gameState?.hasStarted ?? false;
  const showAnswer = gameState?.showAnswer ?? false;
  const isFinished = gameState?.isFinished ?? false;

  const totalTracks = tracks.length;
  const currentTrack = tracks[currentIndex];

  const progressPercent = useMemo(() => {
    if (!totalTracks) return 0;
    return ((currentIndex + 1) / totalTracks) * 100;
  }, [currentIndex, totalTracks]);

  // Update onStatusChange when game state changes
  useEffect(() => {
    if (!onStatusChange || !isClient) return;

    if (isFinished) return onStatusChange("finished");
    if (!hasStarted) return onStatusChange("idle");
    if (showAnswer) return onStatusChange("answer_shown");
    if (isPaused) return onStatusChange("paused");

    onStatusChange("playing");
  }, [hasStarted, showAnswer, isPaused, isFinished, onStatusChange, isClient]);

  // Locate the portal container on the desktop layout
  useEffect(() => {
    const container = document.getElementById("playback-controls-container");
    setPortalContainer(container);
  }, []);

  // Auto-play resumed track
  useEffect(() => {
    if (
      !isClient ||
      !resumedState ||
      !hasStarted ||
      !currentTrack ||
      !deviceId ||
      hasResumedPlayback
    ) {
      return;
    }

    const autoPlayResumedTrack = async () => {
      try {
        await playTrack({
          id: currentTrack.id,
          position_ms: startPosition,
          device_id: deviceId,
        }).unwrap();

        setHasResumedPlayback(true);
        console.log(
          `Auto-played resumed track: ${currentTrack.name} at ${startPosition}ms`,
        );
      } catch (err) {
        console.error("Failed to auto-play resumed track:", err);
      }
    };

    autoPlayResumedTrack();
  }, [
    isClient,
    resumedState,
    hasStarted,
    currentTrack,
    deviceId,
    playTrack,
    startPosition,
    hasResumedPlayback,
  ]);

  const ensureDeviceReady = () => {
    if (!deviceId) {
      toast.warning("Spotify player not ready");
      return false;
    }
    return true;
  };

  const calculateStartPosition = useCallback(
    (duration: number) => {
      if (!random) return seek;
      if (duration <= 30000) return 0;
      return Math.floor(Math.random() * (duration - 30000));
    },
    [random, seek],
  );

  const play = useCallback(
    async (
      track: FormattedTrack,
      position: number,
      retryCount = 0,
    ): Promise<boolean> => {
      if (!deviceId) {
        toast.warning("Spotify player not ready");
        return false;
      }

      try {
        await playTrack({
          id: track.id,
          position_ms: position,
          device_id: deviceId,
        }).unwrap();

        return true;
      } catch (err: any) {
        console.error("Playback failed", err);

        if (err?.status === 404 && retryCount < 3) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          return play(track, position, retryCount + 1);
        }

        if (err?.status === 404) {
          toast.error(
            "Spotify device was not found. Reconnect the Spotify player.",
          );
        } else if (err?.status === 403) {
          toast.error(
            "Spotify playback is not allowed. Check Premium/account access.",
          );
        } else if (err?.status === 401) {
          toast.error("Spotify session expired. Please log in again.");
        } else {
          toast.error("Playback failed. Is Spotify connected?");
        }

        return false;
      }
    },
    [deviceId, playTrack],
  );

  const resetTrackState = useCallback(() => {
    updateGameState({
      showAnswer: false,
    });
    setIsPaused(false);
  }, [updateGameState]);

  const handlePlayFirst = useCallback(async () => {
    if (!currentTrack || !ensureDeviceReady()) return;

    const position = calculateStartPosition(currentTrack.duration_ms);
    const success = await play(currentTrack, position);

    if (!success) return;

    updateGameState({
      currentIndex: 0,
      startPosition: position,
      hasStarted: true,
      isFinished: false,
      showAnswer: false,
    });
  }, [currentTrack, calculateStartPosition, play, updateGameState]);

  const handleReplay = useCallback(async () => {
    if (!currentTrack || !ensureDeviceReady()) return;

    const success = await play(currentTrack, startPosition);

    if (!success) return;

    setIsPaused(false);
  }, [currentTrack, startPosition, play]);

  const handleNext = useCallback(async () => {
    if (!ensureDeviceReady()) return;

    const isLastTrack = currentIndex >= totalTracks - 1;

    if (isLastTrack) {
      updateGameState({
        isFinished: true,
        hasStarted: false,
        showAnswer: false,
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextTrack = tracks[nextIndex];

    if (!nextTrack) return;

    const position = calculateStartPosition(nextTrack.duration_ms);
    const success = await play(nextTrack, position);

    if (!success) return;

    updateGameState({
      currentIndex: nextIndex,
      startPosition: position,
      showAnswer: false,
    });
    setIsPaused(false);
  }, [
    currentIndex,
    totalTracks,
    tracks,
    calculateStartPosition,
    play,
    updateGameState,
  ]);

  const handlePauseToggle = useCallback(async () => {
    if (!hasStarted || isFinished || !ensureDeviceReady()) return;

    try {
      if (isPaused) {
        await resumePlayback({ device_id: deviceId! }).unwrap();
      } else {
        await pausePlayback({ device_id: deviceId! }).unwrap();
      }

      setIsPaused((prev) => !prev);
    } catch (err) {
      console.error("Pause/Resume failed", err);
      toast.error("Pause/Resume failed");
    }
  }, [
    hasStarted,
    isFinished,
    deviceId,
    isPaused,
    pausePlayback,
    resumePlayback,
  ]);

  const handleShowAnswer = useCallback(() => {
    if (isAnswerCoolingDown) return;

    updateGameState({
      showAnswer: true,
    });
    onShowAnswer?.(currentTrack?.image ?? null);

    setIsAnswerCoolingDown(true);
    setTimeout(() => setIsAnswerCoolingDown(false), 4000);
  }, [isAnswerCoolingDown, updateGameState, currentTrack, onShowAnswer]);

  // Control bar JSX, reused for both mobile and desktop via portal
  const controlBar = (
    <div
      className={clsx(
        "w-full flex justify-center z-20",
        !portalContainer && "fixed bottom-10",
      )}
    >
      <div className="flex bg-gray-700 rounded-full p-1">
        <Button
          onClick={handlePauseToggle}
          disabled={isLoading || !deviceId}
          className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed",
            isPaused ? "bg-indigo-400 animate-pulse" : "bg-pink-400",
          )}
        >
          <Image
            src={isPaused ? playbutton : pause}
            width={42}
            height={42}
            alt="Toggle Playback"
          />
        </Button>

        <Button
          onClick={handleReplay}
          disabled={isLoading || !deviceId}
          className="w-20 h-20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src={playagain} width={42} height={42} alt="Replay Track" />
        </Button>
      </div>
    </div>
  );

  if (!isClient || !gameState) {
    return null;
  }

  return (
    <div className="flex flex-col w-full md:h-full">
      {/* Game card */}
      <div className="bg-gray-800 text-white flex flex-col items-center gap-4 p-4 rounded-lg w-[90%] min-w-[340px] self-center flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {gamemode === "classic" ? playlistName || "Playlist" : "Duo Mode"}
        </h2>

        {isFinished && <h3>Quiz Complete!</h3>}

        {hasStarted && (
          <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {showAnswer && currentTrack && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div>
              <p>
                <strong>{currentTrack.name}</strong>
              </p>
              <p>{currentTrack.artist}</p>
              <p>
                <em>{currentTrack.album}</em>
              </p>
            </div>

            {showAddedByInfo && (
              <div className="h-10 flex justify-center">
                <UserInfo id={currentTrack.added_by_id} />
              </div>
            )}

            {currentTrack.image && (
              <img
                src={currentTrack.image}
                alt={currentTrack.name}
                className="w-full rounded-lg max-h-[40vh] object-contain"
              />
            )}
          </div>
        )}

        {!hasStarted && !isFinished && (
          <button
            onClick={handlePlayFirst}
            disabled={isLoading || !deviceId}
            className="bg-pink-400 text-black px-4 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading…" : "Play First Track"}
          </button>
        )}

        {hasStarted && !showAnswer && !isFinished && (
          <button
            onClick={handleShowAnswer}
            disabled={isAnswerCoolingDown}
            className={clsx(
              "px-4 py-2 rounded font-semibold border transition",
              isAnswerCoolingDown
                ? "bg-neutral-700 text-gray-400 cursor-not-allowed"
                : "bg-neutral-800 hover:bg-neutral-700",
            )}
          >
            Show Answer
          </button>
        )}

        {hasStarted && showAnswer && !isFinished && (
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-pink-400 text-black px-4 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentIndex >= totalTracks - 1 ? "Finish Quiz" : "Next Song"}
          </button>
        )}

        {hasStarted && !isFinished && (
          <p className="text-sm text-gray-400">
            Track {currentIndex + 1} / {totalTracks}
          </p>
        )}
      </div>

      {portalContainer ? createPortal(controlBar, portalContainer) : controlBar}
    </div>
  );
}
