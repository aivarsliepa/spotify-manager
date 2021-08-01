import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, useTheme } from "@material-ui/core";
import LabelIcon from "@material-ui/icons/Label";
import { useCallback, useContext, useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import * as SharedTypes from "@aivarsliepa/shared";

import { deleteLabel, useGetAllLabelsQuery, useGetLabelStatsByIdQuery } from "../../store/api";
import { DialogContext } from "../organisms/DialogRoot";
import { useAppDispatch } from "../../store/hooks";

interface Props {
  label: SharedTypes.Label;
}

// TODO: this will need to reworked once all the logic is done and it's more clear how it all fits
export default function LabelContentListItem({ label: { id, name } }: Props) {
  const labelStatsQuery = useGetLabelStatsByIdQuery(id);
  const labelsQuery = useGetAllLabelsQuery();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const dialogContext = useContext(DialogContext);
  const dispatch = useAppDispatch();

  const onMouseEnter = useCallback(() => setIsHovered(true), [setIsHovered]);
  const onMouseLeave = useCallback(() => setIsHovered(false), [setIsHovered]);
  const onRemoveLabel = useCallback(async () => {
    const title = `Delete label "${name}" ?`;
    const contentText = `You are going to permanently delete label "${name}". ${labelStatsQuery.data?.numberOfSongs} songs are going to be affected by this action.`;

    const didConfirm = await dialogContext.showDialog({
      title,
      contentText,
    });

    if (didConfirm) {
      await dispatch(deleteLabel(id));
      labelsQuery.refetch(); // TODO: hack for update
    }
  }, [labelStatsQuery.data, dialogContext, name, id, dispatch, labelsQuery]);

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
      <IconButton aria-label="delete" onClick={isHovered ? onRemoveLabel : undefined}>
        {isHovered ? <DeleteForeverIcon color="error" /> : <LabelIcon color="primary" />}
      </IconButton>

      <ListItemText primary={name} />

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
