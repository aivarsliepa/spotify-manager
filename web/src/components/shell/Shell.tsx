import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";

import { login, selectLoggedIn } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Header from "../header/Header";
import AppDrawer from "../AppDrawer";

const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookies = "; " + document.cookie;
    const parts = cookies.split("; x-jwt=");
    if (parts.length === 2) {
      const jwt = parts[1].split(";")[0];
      dispatch(login(jwt));
    }
  }, [dispatch]);
};

const Shell: React.FC = ({ children }) => {
  useAuth();
  const isLoggedIn = useAppSelector(selectLoggedIn);

  return (
    <>
      <Header />
      <Container>
        {isLoggedIn && <AppDrawer />}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* To push down content from toolbar */}
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Shell;
