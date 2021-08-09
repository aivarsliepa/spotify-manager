import { AppBar as MuiAppBar, Box, Toolbar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { flexGrowRowMixin } from "../../atoms/styledComponents";

import AuthButton from "./AuthButton";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  ...flexGrowRowMixin,
  position: "fixed",
  justifyContent: "flex-end",
  zIndex: theme.zIndex.drawer + 1,
}));

export default function Header() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar>
        <Toolbar>
          <AuthButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
