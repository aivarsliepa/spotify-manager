import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";

import { IconButton } from "@material-ui/core";
import HomeIcon from "../icons/HomeIcon";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectLoggedIn } from "../../store/authSlice";
import { LOGIN_URL } from "../../store/api";

const AuthButton: React.FC = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();

  const onClickHandler = useCallback(() => {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      window.location.href = LOGIN_URL; // redirect to Spotify for auth
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Button color="inherit" onClick={onClickHandler}>
      {isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
};

const Header: React.FC = () => {
  const history = useHistory();
  const onHomeIconClick = useCallback(() => history.push("/"), [history]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="home" onClick={onHomeIconClick}>
            <HomeIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <AuthButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
