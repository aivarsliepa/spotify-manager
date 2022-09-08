import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from ".";
import { deleteAllCookies } from "../utils";

export interface AuthState {
  jwt: string;
}

const initialState: AuthState = {
  jwt: localStorage.getItem("jwt") ?? "",
};

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  deleteAllCookies();
  localStorage.removeItem("jwt");
});

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.jwt = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logoutThunk.fulfilled, state => {
      state.jwt = "";
    });
  },
});

export const { login } = slice.actions;

export const selectJWT = (state: RootState) => state.auth.jwt;

export const selectLoggedIn = createSelector([selectJWT], jwt => !!jwt);

export default slice.reducer;
