import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Main from "../pages/Main";
import Songs from "../pages/Songs";
import Playlists from "../pages/Playlists";
import SongDetails from "../pages/SongDetails";

const LoggedInRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route exact path="/songs" component={Songs} />
    <Route exact path="/songs/:songId" component={SongDetails} />
    <Route exact path="/playlists" component={Playlists} />
    <Redirect to="/" />
  </Switch>
);

export default LoggedInRoutes;
