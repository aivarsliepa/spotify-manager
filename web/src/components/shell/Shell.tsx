import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

import { login } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import Header, { DrawerHeader } from "../header/Header";

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

  return (
    <>
      <Header />
      <Container>
        <DrawerHeader /> {/* Pushes content below header */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Shell;
