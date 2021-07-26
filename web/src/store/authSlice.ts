import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

export interface AuthState {
  jwt: string;
  loggedIn: boolean;
}

const initialState: AuthState = {
  jwt: "",
  loggedIn: false,
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.loggedIn = true;
      state.jwt = action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.jwt = "";
    },
  },
});

export const { login, logout } = slice.actions;

export const selectJWT = (state: RootState) => state.auth.jwt;
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;

export default slice.reducer;
