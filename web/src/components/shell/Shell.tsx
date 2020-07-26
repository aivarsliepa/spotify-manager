import React, { useEffect } from "react";
import { MapStateToProps, MapDispatchToProps, connect } from "react-redux";

import { AppState } from "../../store";
import { logIn } from "../../store/auth/actions";

interface StateProps {}

interface DispatchProps {
  logIn: typeof logIn;
}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

const Shell: React.FC<Props> = ({ logIn, children }) => {
  useEffect(() => {
    const cookies = "; " + document.cookie;
    const parts = cookies.split("; x-jwt=");
    if (parts.length === 2) {
      const jwt = parts[1].split(";")[0];
      logIn(jwt);
    }
  }, [logIn]);

  return <div>{children}</div>;
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
  logIn: jwt => dispatch(logIn(jwt))
});

export default connect(mapStateToProps, mapDispatchToProps)(Shell);
