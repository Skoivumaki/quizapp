"use client";
import { useState, useEffect } from "react";
import {
  usePausePlaybackMutation,
  usePlayTrackMutation,
  useResumePlaybackMutation,
} from "@/spotifyApi";
import UserInfo from "./UserInfo";
import { toast } from "react-toastify";
import { Button } from "./Button";
import clsx from "clsx";
import Image from "next/image";
import play from "@/shared/assets/icons/play.svg";
import pause from "@/shared/assets/icons/pause.svg";
import playagain from "@/shared/assets/icons/playagain.svg";

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
  playlistName?: string;
  tracks: FormattedTrack[];
  accessToken?: string;
  onStatusChange?: (status: string) => void;
  onShowAnswer?: (image: string | null) => void;
  seek?: number;
  random?: boolean;
  deviceId?: string | null;
  gamemode?: string | null;
}

export default function GuessingGame({
  tracks,
  playlistName,
  onStatusChange,
  onShowAnswer,
  seek = 0,
  random = false,
  deviceId = null,
  gamemode = null,
}: GuessingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [playTrack, { isLoading, isError }] = usePlayTrackMutation();
  const [pausePlayback] = usePausePlaybackMutation();
  const [resumePlayback] = useResumePlaybackMutation();

  const [isPaused, setIsPaused] = useState(false);

  if (isError) {
    toast.error(
      "Could not start playback (make sure you have an active Spotify device)",
    );
  }

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

  useEffect(() => {
    if (!onStatusChange || isFinished) return;
    if (!hasStarted) onStatusChange("idle");
    else if (showAnswer) onStatusChange("answer_shown");
    else onStatusChange("playing");
  }, [hasStarted, showAnswer, currentIndex, isFinished, onStatusChange]);

  const handleStartAgain = async () => {
    if (!currentTrack) return;

    try {
      await playTrack({
        id: currentTrack.id,
        position_ms: startPosition,
        device_id: deviceId ?? undefined,
      }).unwrap();
      setHasStarted(true);
      setShowAnswer(false);
      setIsFinished(false);
      onStatusChange?.("playing");
      console.log("Playback started", deviceId);
    } catch (err) {
      console.error("Playback failed", err);
      toast.error(
        `Playback failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handlePauseAndResume = async () => {
    try {
      if (!hasStarted || isFinished) return;

      if (isPaused) {
        await resumePlayback({
          device_id: deviceId ?? undefined,
        }).unwrap();

        setIsPaused(false);
        onStatusChange?.("playing");
      } else {
        await pausePlayback({
          device_id: deviceId ?? undefined,
        }).unwrap();

        setIsPaused(true);
        onStatusChange?.("paused");
      }
    } catch (err) {
      console.error("Pause/resume failed", err);
      toast.error("Failed to pause or resume playback");
    }
  };

  const handlePlay = async () => {
    if (!currentTrack) return;

    const position_ms = random
      ? getRandomSeek(currentTrack.duration_ms || 30000)
      : seek;

    setStartPosition(position_ms);

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
      toast.error(
        `Playback failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleShowAnswer = () => {
    if (isShowAnswerDisabled) return;

    setShowAnswer(true);
    onStatusChange?.("answer_shown");
    onShowAnswer?.(currentTrack?.image ?? null);

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

    setStartPosition(position_ms);

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
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          borderRadius: "8px",
          color: "#fff",
          alignSelf: "center",
          minWidth: "340px",
          width: "90%",
        }}
        className="bg-gray-800"
      >
        {gamemode == "classic" ? (
          <h2 className="text-xl font-bold bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {playlistName || "Playlist"}
          </h2>
        ) : (
          <h2 className="text-xl font-bold bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Duo Mode
          </h2>
        )}
        <h3>{isFinished && "Quiz Complete!"}</h3>

        {hasStarted && (
          <div
            style={{
              width: "100%",
              borderRadius: "6px",
              height: "8px",
              overflow: "hidden",
            }}
            className="bg-gray-700"
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                transition: "width 0.4s ease",
              }}
              className="bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400"
            ></div>
          </div>
        )}

        {showAnswer && currentTrack && (
          <div className="flex flex-col items-center gap-2">
            <div>
              <p>
                <strong>{currentTrack.name}</strong>
              </p>
              <p>{currentTrack.artist}</p>
              <p>
                <em>{currentTrack.album}</em>
              </p>
            </div>
            {gamemode == "duo" && (
              <div className="w-fit h-10 flex justify-center">
                <UserInfo id={currentTrack.added_by_id}></UserInfo>
              </div>
            )}
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
          </div>
        )}

        {!hasStarted && !isFinished ? (
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="bg-pink-400"
            style={{
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
            className="bg-pink-400"
            style={{
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

        {hasStarted && !isFinished && (
          <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
            Track {currentIndex + 1} / {totalTracks}
          </p>
        )}
      </div>
      <div className="flex justify-center fixed bottom-10 w-full">
        <div className="flex bg-gray-800 rounded-full p-1 gap-0">
          <Button
            onClick={handlePauseAndResume}
            disabled={isLoading}
            className={clsx(
              "rounded-full w-20 h-20 transition-all flex justify-center items-center",
              isPaused ? "bg-indigo-400 animate-pulse" : "bg-pink-400",
              isLoading && "opacity-60 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <Image
                src={pause.src}
                width={42}
                height={42}
                alt="Pause Track (loading/disabled)"
              />
            ) : isPaused ? (
              <Image src={play.src} width={42} height={42} alt="Resume Track" />
            ) : (
              <Image src={pause.src} width={42} height={42} alt="Pause Track" />
            )}
          </Button>
          <Button
            onClick={handleStartAgain}
            disabled={isLoading}
            className={clsx(
              "rounded-l-full w-20 h-20 transition-all flex justify-center items-center",
              isLoading && "opacity-100 cursor-not-allowed animate-spin",
            )}
          >
            {isLoading ? (
              <Image
                src={playagain.src}
                width={42}
                height={42}
                alt="Repeat Track (loading/disabled)"
              />
            ) : (
              <Image
                src={playagain.src}
                width={42}
                height={42}
                alt="Repeat Track"
              />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
