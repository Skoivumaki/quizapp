"use client";
import { useState, useEffect } from "react";
import { usePlayTrackMutation } from "@/quizApi";
import { Button, ButtonSize, ButtonTheme } from "./Button";
import Link from "next/link";

interface FormattedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  uri: string;
  duration_ms: number;
}

interface GuessingGameProps {
  playlistName?: string;
  tracks: FormattedTrack[];
  accessToken?: string;
  onStatusChange?: (status: string) => void;
  seek?: number;
  random?: boolean;
  deviceId?: string | null;
}

export default function GuessingGame({
  tracks,
  playlistName,
  accessToken,
  onStatusChange,
  seek = 0,
  random = false,
  deviceId = null,
}: GuessingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [playTrack, { isLoading, isError }] = usePlayTrackMutation();

  const currentTrack = tracks?.[currentIndex];
  const totalTracks = tracks?.length || 0;
  const progressPercent = ((currentIndex + 1) / totalTracks) * 100;

  const getRandomSeek = (trackDurationMs: number) => {
    if (!trackDurationMs || trackDurationMs <= 0) return 0;
    return Math.floor(Math.random() * (trackDurationMs - 30000)); // this makes sure at least 30s is left to play i think
  };

  const [isShowAnswerDisabled, setIsShowAnswerDisabled] = useState(false);
  const SHOW_ANSWER_COOLDOWN = 4000;

  const triggerShowAnswerCooldown = () => {
    setIsShowAnswerDisabled(true);
    setTimeout(() => {
      setIsShowAnswerDisabled(false);
    }, SHOW_ANSWER_COOLDOWN);
  };

  console.log("GuessingGame deviceId:", deviceId);

  useEffect(() => {
    if (!onStatusChange || isFinished) return;
    if (!hasStarted) onStatusChange("idle");
    else if (showAnswer) onStatusChange("answer_shown");
    else onStatusChange("playing");
  }, [hasStarted, showAnswer, currentIndex, isFinished, onStatusChange]);

  const handlePlay = async () => {
    if (!currentTrack) return;
    const position_ms = random
      ? getRandomSeek(currentTrack.duration_ms || 30000)
      : seek;

    try {
      await playTrack({
        id: currentTrack.id,
        position_ms,
        device_id: deviceId ?? undefined,
      }).unwrap();
      setHasStarted(true);
      setShowAnswer(false);
      setIsFinished(false);
      onStatusChange?.("playing");
      console.log("Playback started", deviceId);
    } catch (err) {
      console.error("Playback failed", err);
    }
  };

  const handleShowAnswer = () => {
    if (isShowAnswerDisabled) return;

    setShowAnswer(true);
    onStatusChange?.("answer_shown");

    triggerShowAnswerCooldown();
  };

  const handleNextTrack = async () => {
    if (currentIndex >= totalTracks - 1) {
      setIsFinished(true);
      setHasStarted(false);
      setShowAnswer(false);
      onStatusChange?.("finished");
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextTrack = tracks[nextIndex];
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    triggerShowAnswerCooldown();

    const position_ms = random
      ? getRandomSeek(nextTrack.duration_ms || 30_000)
      : seek;

    try {
      await playTrack({
        id: nextTrack.id,
        position_ms,
        device_id: deviceId ?? undefined,
      }).unwrap();
      onStatusChange?.("playing");
    } catch (err) {
      console.error("Failed to start next track", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "8px",
        background: "#121212",
        color: "#fff",
        alignSelf: "center",
        minWidth: "340px",
        width: "90%",
      }}
    >
      <h2>{playlistName || "Playlist"}</h2>
      <h3>{isFinished ? "Quiz Complete!" : "Guess the Track!"}</h3>

      {hasStarted && (
        <div
          style={{
            width: "100%",
            background: "#333",
            borderRadius: "6px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              background: "#1ed760",
              height: "100%",
              transition: "width 0.4s ease",
            }}
          ></div>
        </div>
      )}

      {!hasStarted && !isFinished ? (
        <button
          onClick={handlePlay}
          disabled={isLoading}
          style={{
            background: "#1ed760",
            color: "#000",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {isLoading ? "Loading…" : "Play First Track"}
        </button>
      ) : hasStarted && !showAnswer ? (
        <button
          onClick={handleShowAnswer}
          disabled={isShowAnswerDisabled}
          className={`
    border border-neutral-600 rounded-md px-4 py-2 font-semibold
    transition-all duration-300 flex flex-row items-center justify-center
    ${
      isShowAnswerDisabled
        ? "bg-neutral-700 text-gray-400 cursor-not-allowed opacity-100"
        : "bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
    }
  `}
        >
          {isShowAnswerDisabled && (
            <svg
              class="mr-3 -ml-1 size-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          {isShowAnswerDisabled ? "Show Answer" : "Show Answer"}
        </button>
      ) : isFinished ? null : (
        <button
          onClick={handleNextTrack}
          style={{
            background: "#1ed760",
            color: "#000",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {currentIndex >= totalTracks - 1 ? "Finish Quiz" : "Next Song"}
        </button>
      )}

      {isError && (
        <p style={{ color: "red", fontSize: "0.9rem" }}>
          Could not start playback (make sure you have an active Spotify device)
        </p>
      )}

      {showAnswer && currentTrack && (
        <div style={{ textAlign: "center" }}>
          {currentTrack.image && (
            <img
              src={currentTrack.image}
              alt={currentTrack.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            />
          )}
          <p>
            <strong>{currentTrack.name}</strong>
          </p>
          <p>{currentTrack.artist}</p>
          <p>
            <em>{currentTrack.album}</em>
          </p>
        </div>
      )}

      {hasStarted && !isFinished && (
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Track {currentIndex + 1} / {totalTracks}
        </p>
      )}
    </div>
  );
}
