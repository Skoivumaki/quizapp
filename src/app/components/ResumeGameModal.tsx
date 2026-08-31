// components/ResumeGameModal.tsx
"use client";

import { useState } from "react";
import { Button, ButtonSize, ButtonTheme } from "./Button";
import { GameState } from "@/hooks/useGameState";

interface ResumeGameModalProps {
  gameState: GameState;
  onResume: () => void;
  onStartNew: () => void;
}

export default function ResumeGameModal({
  gameState,
  onResume,
  onStartNew,
}: ResumeGameModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleResume = () => {
    setIsOpen(false);
    onResume();
  };

  const handleStartNew = () => {
    setIsOpen(false);
    onStartNew();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4 text-white">
        <h2 className="text-2xl font-bold mb-4">Resume Game?</h2>

        <p className="mb-4 text-gray-300">
          You have an unfinished game in{" "}
          <strong>{gameState.playlistName}</strong> at track{" "}
          <strong>{gameState.currentIndex + 1}</strong> of{" "}
          <strong>{gameState.tracks.length}</strong>.
        </p>

        <div className="flex gap-4">
          <Button
            theme={ButtonTheme.PRIMARY}
            size={ButtonSize.L}
            onClick={handleResume}
          >
            Resume
          </Button>

          <Button
            theme={ButtonTheme.INVERT}
            size={ButtonSize.L}
            onClick={handleStartNew}
          >
            Start New
          </Button>
        </div>
      </div>
    </div>
  );
}
