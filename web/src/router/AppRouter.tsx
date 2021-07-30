import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import Shell from "../components/organisms/Shell";
import { useAppSelector } from "../store/hooks";
import { selectLoggedIn } from "../store/authSlice";
import MainPage from "../components/pages/MainPage";
import SongsPage from "../components/pages/SongsPage";
import PlaylistsPage from "../components/pages/PlaylistsPage";
import SongDetailPage from "../components/pages/SongDetailPage";
import PlaylistDetailsPage from "../components/pages/PlaylistDetailsPage";
import IndexPage from "../components/pages/IndexPage";
import LabelsPage from "../components/pages/LabelsPage";

const LoggedInRoutes = () => (
  <>
    <Route exact path="/" component={MainPage} />
    <Route exact path="/songs" component={SongsPage} />
    <Route exact path="/songs/:songId" component={SongDetailPage} />
    <Route exact path="/playlists" component={PlaylistsPage} />
    <Route exact path="/playlists/:playlistId" component={PlaylistDetailsPage} />
    <Route exact path="/labels" component={LabelsPage} />
    <Redirect to="/" />
  </>
);

const LoggedOutRoutes = () => (
  <>
    <Route exact path="/" component={IndexPage} />
    <Redirect to="/" />
  </>
);

export default function AppRouter() {
  const loggedIn = useAppSelector(selectLoggedIn);

  return (
    <BrowserRouter>
      <Shell>
        <Switch>{loggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</Switch>
      </Shell>
    </BrowserRouter>
  );
}
