import React from "react";
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";

import AppRouter from "./router/AppRouter";
import { store } from "./store";

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <CssBaseline />
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
