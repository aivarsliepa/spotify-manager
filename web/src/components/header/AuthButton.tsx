import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";

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

export default AuthButton;
