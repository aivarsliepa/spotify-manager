import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Main from "../pages/main/Main";
import Songs from "../pages/songs/Songs";
import SongDetails from "../pages/songDetails/SongDetails";

const LoggedInRoutes: React.FC = () => (
  <Switch>
    {/* <Route exact path="/" component={Main} /> */}
    <Route exact path="/" component={Songs} />
    <Route exact path="/songs/:songId" component={SongDetails} />
    <Redirect to="/" />
  </Switch>
);

export default LoggedInRoutes;
