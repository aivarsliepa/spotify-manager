import React from "react";
import { MapStateToProps, connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppState } from "../store";
import Shell from "../components/shell/Shell";
import Header from "../components/header/Header";
import LoggedInRoutes from "./LoggedInRoutes";
import LoggedOutRoutes from "./LoggedOutRoutes";

interface StateProps {
  loggedIn: boolean;
}

interface OwnProps {}

type Props = StateProps & OwnProps;

const AppRouter: React.FC<Props> = props => (
  <Shell>
    <Header />
    <BrowserRouter>{props.loggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</BrowserRouter>
  </Shell>
);

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = ({ auth: { loggedIn } }) => ({ loggedIn });

export default connect(mapStateToProps)(AppRouter);
