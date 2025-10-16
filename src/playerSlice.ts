import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 100,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
  },
});

export const { setCurrentTrack, setIsPlaying, setVolume } = playerSlice.actions;
export default playerSlice.reducer;
