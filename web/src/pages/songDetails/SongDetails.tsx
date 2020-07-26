import React, { useEffect } from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";
import { useParams } from "react-router-dom";

import { AppState } from "../../store";
import { fetchSongInfo } from "../../api";

interface StateProps {}

interface DispatchProps {}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const SongDetails: React.FC<Props> = () => {
  const { songId } = useParams();

  useEffect(() => {
    if (songId) {
      fetchSongInfo(songId)
        .then(console.log)
        .catch(console.error);
    }
  });

  console.log("songId", songId);
  return <div>SongDetails works!</div>;
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SongDetails);
