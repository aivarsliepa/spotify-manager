import { configureStore } from "@reduxjs/toolkit";

import authReducer, { login, selectJWT, selectLoggedIn } from "./authSlice";
import songsReducer from "./songsSlice";
import playlistsReducer from "./playlistsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songsReducer,
    playlists: playlistsReducer,
    // [showsApi.reducerPath]: showsApi.reducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(showsApi.middleware),
});

const storedJwt = localStorage.getItem("jwt");
if (storedJwt) {
  store.dispatch(login(storedJwt));
}

window.addEventListener("beforeunload", () => {
  const loggedIn = selectLoggedIn(store.getState());

  if (loggedIn) {
    const jwt = selectJWT(store.getState());
    localStorage.setItem("jwt", jwt);
  } else {
    localStorage.removeItem("jwt");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
