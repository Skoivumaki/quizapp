import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
        expiresIn?: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresIn = action.payload.expiresIn;
    },
    logout: (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.expiresIn = undefined;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
