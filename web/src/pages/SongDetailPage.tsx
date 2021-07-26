import React from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";
import { useParams } from "react-router-dom";

import { AppState } from "../store";
import SongDetails from "../components/SongDetails";

interface StateProps {}

interface DispatchProps {}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

interface URLParams {
  songId: string
}

const SongDetailPage: React.FC<Props> = () => {
  const { songId } = useParams<URLParams>();

  return <SongDetails songId={songId} />;
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (_state, _ownProps) => ({});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = _dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SongDetailPage);
