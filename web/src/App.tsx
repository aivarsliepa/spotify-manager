import React from "react";
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";

import AppRouter from "./router/AppRouter";
import { store } from "./store";

export default function App() {
  return (
    <React.StrictMode>
      <CssBaseline />
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </React.StrictMode>
  );
}
