import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import Shell from "../components/organisms/Shell";
import { useAppSelector } from "../store/hooks";
import { selectLoggedIn } from "../store/authSlice";
import Main from "../components/pages/Main";
import Songs from "../components/pages/Songs";
import Playlists from "../components/pages/Playlists";
import SongDetailPage from "../components/pages/SongDetailPage";
import PlaylistDetails from "../components/pages/PlaylistDetails";
import Index from "../components/pages/Index";

const LoggedInRoutes = () => (
  <>
    <Route exact path="/" component={Main} />
    <Route exact path="/songs" component={Songs} />
    <Route exact path="/songs/:songId" component={SongDetailPage} />
    <Route exact path="/playlists" component={Playlists} />
    <Route exact path="/playlists/:playlistId" component={PlaylistDetails} />
    <Redirect to="/" />
  </>
);

const LoggedOutRoutes = () => (
  <>
    <Route exact path="/" component={Index} />
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
