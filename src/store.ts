import { configureStore } from "@reduxjs/toolkit";
import { spotifyApi } from "./spotifyApi";
import playerReducer from "./playerSlice";
import { quizApi } from "./quizApi";

export const store = configureStore({
  reducer: {
    [spotifyApi.reducerPath]: spotifyApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyApi.middleware, quizApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
