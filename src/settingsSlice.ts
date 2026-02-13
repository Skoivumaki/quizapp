import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  autoShowScoreboard: boolean;
  useInternalPlayer: boolean;
  showAddedByInfo: boolean;
}

const initialState: SettingsState = {
  autoShowScoreboard: true,
  useInternalPlayer: false,
  showAddedByInfo: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAutoShowScoreboard(state, action: PayloadAction<boolean>) {
      state.autoShowScoreboard = action.payload;
    },
    setUseInternalPlayer(state, action: PayloadAction<boolean>) {
      state.useInternalPlayer = action.payload;
    },
    setShowAddedByInfo(state, action: PayloadAction<boolean>) {
      state.showAddedByInfo = action.payload;
    },
  },
});

export const {
  setAutoShowScoreboard,
  setUseInternalPlayer,
  setShowAddedByInfo,
} = settingsSlice.actions;

export default settingsSlice.reducer;
