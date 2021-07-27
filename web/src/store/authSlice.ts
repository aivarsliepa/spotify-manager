import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { RootState } from ".";

export interface AuthState {
  jwt: string;
}

const initialState: AuthState = {
  jwt: "",
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.jwt = action.payload;
    },
    logout(state) {
      state.jwt = "";
    },
  },
});

export const { login, logout } = slice.actions;

export const selectJWT = (state: RootState) => state.auth.jwt;

export const selectLoggedIn = createSelector([selectJWT], jwt => !!jwt);

export default slice.reducer;
