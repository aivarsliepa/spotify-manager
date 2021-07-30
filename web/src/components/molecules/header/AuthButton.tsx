import { useCallback } from "react";
import { Button } from "@material-ui/core";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logoutThunk, selectLoggedIn } from "../../../store/authSlice";
import { LOGIN_URL } from "../../../store/api";

export default function AuthButton() {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();

  const onClickHandler = useCallback(() => {
    if (isLoggedIn) {
      dispatch(logoutThunk());
    } else {
      window.location.href = LOGIN_URL; // redirect to Spotify for auth
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Button color="inherit" onClick={onClickHandler}>
      {isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
}
