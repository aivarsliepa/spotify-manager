import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, useTheme } from "@material-ui/core";
import LabelIcon from "@material-ui/icons/Label";
import { useCallback, useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

interface Props {
  text: string;
  onClick: () => void;
}

export default function LabelContentListItem({ text, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const onMouseEnter = useCallback(() => setIsHovered(true), [setIsHovered]);
  const onMouseLeave = useCallback(() => setIsHovered(false), [setIsHovered]);
  const onRemoveLabel = useCallback(() => {
    // TODO
  }, []);

  const onEditLabel = useCallback(() => {
    // TODO
  }, []);

  const openOpenSongs = useCallback(() => {
    // TODO
  }, []);

  const style: { bgcolor?: string } = {};
  if (isHovered) {
    style.bgcolor = theme.palette.action.hover;
  }

  return (
    <ListItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} sx={style}>
      <IconButton aria-label="delete">
        {isHovered ? <DeleteForeverIcon color="error" onClick={onRemoveLabel} /> : <LabelIcon color="primary" />}
      </IconButton>

      <ListItemText primary={text} />

      <ListItemSecondaryAction>
        <IconButton aria-label="open songs" onClick={openOpenSongs}>
          <LibraryMusicIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={onEditLabel}>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
