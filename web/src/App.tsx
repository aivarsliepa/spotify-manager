import React from "react";
import { Provider } from "react-redux";

import AppRouter from "./router/AppRouter";
import { store } from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;
