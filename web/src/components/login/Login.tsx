import React from "react";
import { MapDispatchToProps, connect } from "react-redux";

import { logIn } from "../../store/auth/actions";
import { LOGIN_URL } from "../../api";

const spotifyLogin = () => {
  window.location.href = LOGIN_URL;
};

interface DispatchProps {
  logIn: typeof logIn;
}

interface OwnProps {}

type Props = DispatchProps & OwnProps;

const Login: React.FC<Props> = () => {
  return (
    <div>
      <button onClick={spotifyLogin}>click me</button>
    </div>
  );
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = dispatch => ({
  logIn: jwt => dispatch(logIn(jwt))
});

export default connect(null, mapDispatchToProps)(Login);
