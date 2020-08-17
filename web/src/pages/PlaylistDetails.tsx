import React, { useEffect } from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";
import { useParams } from "react-router-dom";

import { AppState } from "../store";
import { fetchSongsForPlaylist } from "../api";
import SongList from "../components/song-list/SongList";
import { Song } from "../store/songs/types";
import { setSongs } from "../store/songs/actions";

interface StateProps {
  songs: Song[];
}

interface DispatchProps {
  setSongs: typeof setSongs;
}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const PlaylistDetails: React.FC<Props> = ({ setSongs, songs }) => {
  const { playlistId } = useParams();

  useEffect(() => {
    if (playlistId) {
      // TODO error handling
      fetchSongsForPlaylist(playlistId)
        .then(res => setSongs(res.songs))
        .catch(console.error);
    }
  }, [playlistId, setSongs]);

  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = ({ songs: { songs } }) => ({
  songs,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
  setSongs: songs => dispatch(setSongs(songs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetails);
