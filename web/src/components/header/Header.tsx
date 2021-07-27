import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";

import { IconButton } from "@material-ui/core";
import HomeIcon from "../icons/HomeIcon";

const Header: React.FC = () => {
  const history = useHistory();
  const onHomeIconClick = useCallback(() => history.push("/"), [history]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" onClick={onHomeIconClick}>
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
