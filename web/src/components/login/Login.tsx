import React from "react";

import { LOGIN_URL } from "../../api";

const spotifyLogin = () => {
  window.location.href = LOGIN_URL;
};

const Login: React.FC = () => {
  return (
    <div>
      <button onClick={spotifyLogin}>click me</button>
    </div>
  );
};

export default Login;
