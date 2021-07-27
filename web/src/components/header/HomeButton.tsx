import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { IconButton } from "@material-ui/core";
import HomeIcon from "../icons/HomeIcon";

const HomeButton: React.FC = () => {
  const history = useHistory();
  const onHomeIconClick = useCallback(() => history.push("/"), [history]);

  return (
    <IconButton edge="start" color="inherit" aria-label="home" onClick={onHomeIconClick}>
      <HomeIcon />
    </IconButton>
  );
};

export default HomeButton;
