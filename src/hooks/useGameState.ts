// hooks/useGameState.ts
"use client";

import { useEffect, useState, useCallback } from "react";

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

export interface GameState {
  playlistId: string;
  playlistId2?: string;
  playlistName: string;
  tracks: FormattedTrack[];
  currentIndex: number;
  startPosition: number;
  hasStarted: boolean;
  showAnswer: boolean;
  isFinished: boolean;
  gamemode: string;
  seek: number;
  random: boolean;
}

const STORAGE_KEY = "quizapp-game-state";

const createInitialState = (overrides: Partial<GameState> = {}): GameState => ({
  playlistId: "",
  playlistName: "",
  tracks: [],
  currentIndex: 0,
  startPosition: 0,
  hasStarted: false,
  showAnswer: false,
  isFinished: false,
  gamemode: "classic",
  seek: 0,
  random: false,
  ...overrides,
});

export function useGameState(initialState?: Partial<GameState>) {
  // Only initialize on client
  const [isClient, setIsClient] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize state only on client side
  useEffect(() => {
    setIsClient(true);
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    } else if (initialState) {
      setGameState(createInitialState(initialState));
    } else {
      setGameState(createInitialState());
    }
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (!isClient || !gameState) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (err) {
      console.error("Failed to save game state to localStorage:", err);
    }
  }, [gameState, isClient]);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => {
      if (!prev) return createInitialState(updates);
      return { ...prev, ...updates };
    });
  }, []);

  const clearGameState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(createInitialState());
    } catch (err) {
      console.error("Failed to clear game state:", err);
    }
  }, []);

  return {
    gameState,
    updateGameState,
    clearGameState,
    isClient,
  };
}

// Utility function to load state from localStorage
export function loadGameState(): GameState | null {
  try {
    // Check if we're in browser
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate that it's a complete game state
    if (
      parsed.playlistId &&
      parsed.tracks &&
      Array.isArray(parsed.tracks) &&
      typeof parsed.currentIndex === "number"
    ) {
      return parsed as GameState;
    }

    return null;
  } catch (err) {
    console.error("Failed to load game state from localStorage:", err);
    return null;
  }
}

// Utility function to check if there's a resumable game
export function hasResumableGame(): boolean {
  const state = loadGameState();
  return state !== null && state.isFinished === false;
}

// Utility function to clear saved game state
export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear saved game state:", err);
  }
}
