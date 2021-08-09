import { Drawer as MuiDrawer, Stack, styled, Toolbar } from "@material-ui/core";
import MusicIcon from "@material-ui/icons/LibraryMusic";
import ListIcon from "@material-ui/icons/List";
import LabelIcon from "@material-ui/icons/Label";

import HomeIcon from "../atoms/icons/HomeIcon";
import NavLinkButton from "../atoms/NavLinkButton";

const drawerWidth = 240;
const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
});

export default function AppDrawer() {
  return (
    <Drawer variant="permanent">
      <Toolbar />
      <Stack direction="column" sx={{ overflow: "auto" }}>
        <NavLinkButton to="/" icon={<HomeIcon />} label="Home" exact />
        <NavLinkButton to="/songs" icon={<MusicIcon />} label="Songs" />
        <NavLinkButton to="/playlists" icon={<ListIcon />} label="Playlists" />
        <NavLinkButton to="/labels" icon={<LabelIcon />} label="Labels" />
      </Stack>
    </Drawer>
  );
}
