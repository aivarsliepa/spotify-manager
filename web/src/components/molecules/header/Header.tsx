import { AppBar as MuiAppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { flexGrowColumnMixin, flexGrowRowMixin } from "../../atoms/styledComponents";

import AuthButton from "./AuthButton";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  ...flexGrowRowMixin,
  position: "fixed",
  zIndex: theme.zIndex.drawer + 1,
}));

const TextBox = styled("div")({
  ...flexGrowColumnMixin,
  justifyContent: "center",
});

export default function Header() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar>
        <TextBox>
          <Typography variant="h6">News</Typography>
        </TextBox>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <AuthButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
