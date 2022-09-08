import { configureStore } from "@reduxjs/toolkit";

import authReducer, { selectJWT, selectLoggedIn } from "./authSlice";
import filterReducer from "./filterSlice";
import checkboxReducer from "./checkboxesSlice";
import api from "./api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
    checkboxes: checkboxReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
});

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
