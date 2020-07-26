import React, { useEffect } from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";

import { AppState } from "../../store";
import { setSongs } from "../../store/songs/actions";
import { Song } from "../../store/songs/types";
import { fetchSongs } from "../../api";
import SongList from "../../components/song-list/SongList";

interface StateProps {
  songs: Song[];
}

interface DispatchProps {
  setSongs: typeof setSongs;
}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const Songs: React.FC<Props> = ({ setSongs, songs }) => {
  useEffect(() => {
    // TODO: error handling
    fetchSongs().then(({ songs }) => setSongs(songs));
  }, [setSongs]);

  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = ({ songs: { songs } }) => ({
  songs
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
  setSongs: songs => dispatch(setSongs(songs))
});

export default connect(mapStateToProps, mapDispatchToProps)(Songs);
