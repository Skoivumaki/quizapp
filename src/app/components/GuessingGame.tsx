"use client";

import { useState, useEffect, useMemo } from "react";
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
import play from "@/shared/assets/icons/play.svg";
import pause from "@/shared/assets/icons/pause.svg";
import playagain from "@/shared/assets/icons/playagain.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  onStatusChange?: (status: string) => void;
  onShowAnswer?: (image: string | null) => void;
  seek?: number;
  random?: boolean;
  deviceId?: string | null;
  gamemode?: string | null;
}

export default function GuessingGame({
  playlistName,
  tracks,
  onStatusChange,
  onShowAnswer,
  seek = 0,
  random = false,
  deviceId,
  gamemode = "classic",
}: GuessingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startPosition, setStartPosition] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCoolingDown, setIsAnswerCoolingDown] = useState(false);

  const [playTrack, { isLoading, isError }] = usePlayTrackMutation();
  const [pausePlayback] = usePausePlaybackMutation();
  const [resumePlayback] = useResumePlaybackMutation();

  const showAddedByInfo = useSelector(
    (state: RootState) => state.settings.showAddedByInfo,
  );

  const totalTracks = tracks.length;
  const currentTrack = tracks[currentIndex];

  const progressPercent = useMemo(() => {
    if (!totalTracks) return 0;
    return ((currentIndex + 1) / totalTracks) * 100;
  }, [currentIndex, totalTracks]);

  useEffect(() => {
    if (isError) {
      toast.error("Playback failed. Is Spotify connected?");
    }
  }, [isError]);

  useEffect(() => {
    if (!onStatusChange) return;

    if (isFinished) return onStatusChange("finished");
    if (!hasStarted) return onStatusChange("idle");
    if (showAnswer) return onStatusChange("answer_shown");
    if (isPaused) return onStatusChange("paused");

    onStatusChange("playing");
  }, [hasStarted, showAnswer, isPaused, isFinished, onStatusChange]);

  const ensureDeviceReady = () => {
    if (!deviceId) {
      toast.warning("Spotify player not ready");
      return false;
    }
    return true;
  };

  const calculateStartPosition = (duration: number) => {
    if (!random) return seek;
    if (duration <= 30000) return 0;
    return Math.floor(Math.random() * (duration - 30000));
  };

  const play = async (track: FormattedTrack, position: number) => {
    if (!deviceId) return;

    try {
      await playTrack({
        id: track.id,
        position_ms: position,
        device_id: deviceId,
      }).unwrap();
    } catch (err: any) {
      if (err?.status === 404) {
        await new Promise((r) => setTimeout(r, 800));
        return play(track, position);
      }
      toast.error("Playback failed");
    }
  };

  const resetTrackState = () => {
    setShowAnswer(false);
    setIsPaused(false);
  };

  const handlePlayFirst = async () => {
    if (!currentTrack || !ensureDeviceReady()) return;

    const position = calculateStartPosition(currentTrack.duration_ms);
    setStartPosition(position);

    await play(currentTrack, position);

    setHasStarted(true);
    setIsFinished(false);
    resetTrackState();
  };

  const handleReplay = async () => {
    if (!currentTrack || !ensureDeviceReady()) return;

    await play(currentTrack, startPosition);
    setIsPaused(false);
  };

  const handleNext = async () => {
    if (!ensureDeviceReady()) return;

    const isLastTrack = currentIndex >= totalTracks - 1;

    if (isLastTrack) {
      setIsFinished(true);
      setHasStarted(false);
      setShowAnswer(false);
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextTrack = tracks[nextIndex];

    const position = calculateStartPosition(nextTrack.duration_ms);

    await play(nextTrack, position);

    setCurrentIndex(nextIndex);
    setStartPosition(position);
    resetTrackState();
  };

  const handlePauseToggle = async () => {
    if (!hasStarted || isFinished || !ensureDeviceReady()) return;

    try {
      if (isPaused) {
        await resumePlayback({ device_id: deviceId! }).unwrap();
      } else {
        await pausePlayback({ device_id: deviceId! }).unwrap();
      }
      setIsPaused((prev) => !prev);
    } catch {
      toast.error("Pause/Resume failed");
    }
  };

  const handleShowAnswer = () => {
    if (isAnswerCoolingDown) return;

    setShowAnswer(true);
    onShowAnswer?.(currentTrack?.image ?? null);

    setIsAnswerCoolingDown(true);
    setTimeout(() => setIsAnswerCoolingDown(false), 4000);
  };

  return (
    <>
      <div className="bg-gray-800 text-white flex flex-col items-center gap-4 p-4 rounded-lg w-[90%] min-w-[340px] self-center">
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
                className="w-full rounded-lg"
              />
            )}
          </div>
        )}

        {!hasStarted && !isFinished && (
          <button
            onClick={handlePlayFirst}
            disabled={isLoading}
            className="bg-pink-400 text-black px-4 py-2 rounded font-semibold"
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
            className="bg-pink-400 text-black px-4 py-2 rounded font-semibold"
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
      <div className="fixed bottom-10 w-full flex justify-center">
        <div className="flex bg-gray-800 rounded-full p-1">
          <Button
            onClick={handlePauseToggle}
            disabled={isLoading}
            className={clsx(
              "w-20 h-20 rounded-full flex items-center justify-center transition",
              isPaused ? "bg-indigo-400 animate-pulse" : "bg-pink-400",
            )}
          >
            <Image
              src={isPaused ? play : pause}
              width={42}
              height={42}
              alt="Toggle Playback"
            />
          </Button>

          <Button
            onClick={handleReplay}
            disabled={isLoading}
            className="w-20 h-20 flex items-center justify-center"
          >
            <Image src={playagain} width={42} height={42} alt="Replay Track" />
          </Button>
        </div>
      </div>
    </>
  );
}
