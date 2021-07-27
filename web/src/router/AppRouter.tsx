import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import Shell from "../components/shell/Shell";
import { useAppSelector } from "../store/hooks";
import { selectLoggedIn } from "../store/authSlice";
import Main from "../pages/Main";
import Songs from "../pages/Songs";
import Playlists from "../pages/Playlists";
import SongDetailPage from "../pages/SongDetailPage";
import PlaylistDetails from "../pages/PlaylistDetails";
import Index from "../pages/Index";

const LoggedInRoutes: React.FC = () => (
  <>
    <Route exact path="/" component={Main} />
    <Route exact path="/songs" component={Songs} />
    <Route exact path="/songs/:songId" component={SongDetailPage} />
    <Route exact path="/playlists" component={Playlists} />
    <Route exact path="/playlists/:playlistId" component={PlaylistDetails} />
    <Redirect to="/" />
  </>
);

const LoggedOutRoutes: React.FC = () => (
  <>
    <Route exact path="/" component={Index} />
    <Redirect to="/" />
  </>
);

const AppRouter: React.FC = () => {
  const loggedIn = useAppSelector(selectLoggedIn);

  return (
    <BrowserRouter>
      <Shell>
        <Switch>{loggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</Switch>
      </Shell>
    </BrowserRouter>
  );
};

export default AppRouter;
