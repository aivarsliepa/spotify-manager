import { useEffect } from "react";
import { Box, Container, Toolbar } from "@material-ui/core";

import { login, selectLoggedIn } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Header from "../molecules/header/Header";
import AppDrawer from "./AppDrawer";
import { WithChildren } from "../../types";
import { useStyles } from "../../styleHooks";

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

export default function Shell({ children }: WithChildren) {
  useAuth();
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const styles = useStyles();

  return (
    <>
      <Header />
      {/* Have to use sx={} , because class gets overwritten */}
      <Container sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {isLoggedIn && <AppDrawer />}
        <Box component="main" className={styles.flexGrowColumn} sx={{ p: 3 }}>
          <Toolbar /> {/* To push down content from toolbar */}
          {children}
        </Box>
      </Container>
    </>
  );
}
