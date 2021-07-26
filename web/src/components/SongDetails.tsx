import React from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";

import { AppState } from "../store";
import { Song } from "../store/songs/types";
import SongTitle from "./SongTitle";
import { playSong } from "../api";
import SongLabels from "./SongLabels";

interface StateProps {
  song?: Song;
}

interface DispatchProps {}

interface OwnProps {
  songId?: string;
}

type Props = StateProps & DispatchProps & OwnProps;

const SongDetails: React.FC<Props> = props => {
  if (!props.song) {
    return null;
  }

  console.log(props.song);
  return (
    <div>
      <SongTitle song={props.song} />
      <button
        onClick={() => {
          playSong(props.song!.spotifyId);
        }}
      >
        Play
      </button>
      <SongLabels song={props.song} />
    </div>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state, ownProps) => ({
  song: state.songs.songs.find(song => song.spotifyId === ownProps.songId),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = _dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SongDetails);
