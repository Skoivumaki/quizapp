import { configureStore } from "@reduxjs/toolkit";
import { spotifyApi } from "./spotifyApi";
import playerReducer from "./playerSlice";
import settingsReducer from "./settingsSlice";
import { quizApi } from "./quizApi";

const loadSettings = () => {
  try {
    const serialized = localStorage.getItem("settings");
    if (!serialized) return undefined;
    return { settings: JSON.parse(serialized) };
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    [spotifyApi.reducerPath]: spotifyApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    player: playerReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyApi.middleware, quizApi.middleware),
  preloadedState: loadSettings(),
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("settings", JSON.stringify(state.settings));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
