import React from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";

import { AppState } from "../../store";

interface StateProps {}

interface DispatchProps {}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const Header: React.FC<Props> = () => {
  return <div>Header works!</div>;
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
