import React from "react";
import { BrowserRouter } from "react-router-dom";

import Shell from "../components/shell/Shell";
import Header from "../components/header/Header";
import LoggedInRoutes from "./LoggedInRoutes";
import LoggedOutRoutes from "./LoggedOutRoutes";
import { useAppSelector } from "../store/hooks";
import { selectLoggedIn } from "../store/authSlice";

const AppRouter: React.FC = () => {
  const loggedIn = useAppSelector(selectLoggedIn);

  return (
    <Shell>
      <Header />
      <BrowserRouter>{loggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</BrowserRouter>
    </Shell>
  );
};

export default AppRouter;
