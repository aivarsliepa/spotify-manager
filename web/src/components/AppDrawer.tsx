import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MusicIcon from "@material-ui/icons/LibraryMusic";
import ListIcon from "@material-ui/icons/List";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";

import HomeIcon from "./icons/HomeIcon";

const drawerWidth = 240;

export default function AppDrawer() {
  const history = useHistory();
  const onHomeClick = useCallback(() => history.push("/"), [history]);
  const onPlaylistsClick = useCallback(() => history.push("/playlists"), [history]);
  const onSongsClick = useCallback(() => history.push("/songs"), [history]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {/* Home is probably not needed, will keep for no */}
          <ListItem button onClick={onHomeClick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={onPlaylistsClick}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Playlists" />
          </ListItem>

          <ListItem button onClick={onSongsClick}>
            <ListItemIcon>
              <MusicIcon />
            </ListItemIcon>
            <ListItemText primary="Songs" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
