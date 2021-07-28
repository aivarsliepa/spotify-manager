import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";

import AuthButton from "./AuthButton";
export default function Header() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <AuthButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
