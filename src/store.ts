import { configureStore } from "@reduxjs/toolkit";
import { spotifyApi } from "./spotifyApi";
import playerReducer from "./playerSlice";
import settingsReducer from "./settingsSlice";
import { quizApi } from "./quizApi";

const isBrowser = typeof window !== "undefined";

const loadSettings = () => {
  if (!isBrowser) return undefined;

  try {
    const serialized = window.localStorage.getItem("settings");

    if (!serialized) return undefined;

    return {
      settings: JSON.parse(serialized),
    };
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

if (isBrowser) {
  store.subscribe(() => {
    const state = store.getState();

    try {
      window.localStorage.setItem("settings", JSON.stringify(state.settings));
    } catch {
      // Ignore localStorage write errors, for example private browsing mode.
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
