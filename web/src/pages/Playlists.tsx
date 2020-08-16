import React, { useEffect } from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";

import { AppState } from "../store";
import { fetchPlaylists } from "../api";
import { setPlaylists } from "../store/playlists/actions";
import { Playlist } from "../store/playlists/types";
import PlaylistList from "../components/playlist/PlaylistList";

interface StateProps {
  playlists: Playlist[];
}

interface DispatchProps {
  setPlaylists: typeof setPlaylists;
}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const Songs: React.FC<Props> = ({ setPlaylists, playlists }) => {
  useEffect(() => {
    // TODO: error handling
    fetchPlaylists()
      .then(({ playlists }) => setPlaylists(playlists))
      .catch(console.log);
  }, [setPlaylists]);

  return (
    <div>
      <PlaylistList playlists={playlists} />
    </div>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = ({ playlists: { playlists } }) => ({
  playlists,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
  setPlaylists: playlists => dispatch(setPlaylists(playlists)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Songs);
