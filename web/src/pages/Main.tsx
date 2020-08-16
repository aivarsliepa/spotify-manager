import React from "react";
import { NavLink } from "react-router-dom";

const Main: React.FC = () => {
  return (
    <div>
      <NavLink to="/playlists">Playlists</NavLink>
    </div>
  );
};

export default Main;
