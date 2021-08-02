import { IconButton, Input, InputAdornment, ListItem, ListItemSecondaryAction, ListItemText, useTheme } from "@material-ui/core";
import LabelIcon from "@material-ui/icons/Label";
import { useCallback, useContext, useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import * as SharedTypes from "@aivarsliepa/shared";
import CheckIcon from "@material-ui/icons/Check";

import { deleteLabel, mergeLabels, patchLabel, useGetAllLabelsQuery, useGetLabelStatsByIdQuery } from "../../store/api";
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
  const [isEditing, setIsEditing] = useState(false);
  const [rename, setRename] = useState(name);

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
    setIsEditing(!isEditing);
  }, [isEditing, setIsEditing]);

  const onRenameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setRename(event.target.value), [setRename]);

  const onCommitEdit = useCallback(async () => {
    const allLabels = labelsQuery.data!.labels;
    const existingLabel = allLabels.find(label => label.name === rename);

    if (existingLabel) {
      const title = `Merge labels "${name}" and "${existingLabel.name}" ?`;
      const contentText = `You are trying to rename label "${name}" to "${existingLabel.name}", but it already exists. Do you want to merge these labels?
      Songs affected: TODO`;

      const didConfirm = await dialogContext.showDialog({
        title,
        contentText,
      });

      if (didConfirm) {
        await dispatch(mergeLabels({ name: rename, ids: [id, existingLabel.id] }));
        labelsQuery.refetch(); // TODO: needs better update logic
        setIsEditing(false);
        // TODO: this does not refetch affected songs, older info about labels are still cached and reload is necessary.
        // need to rework how data is stored and fetched to fix this, currently it's kind of a hack
      }
    } else {
      await dispatch(patchLabel({ body: { name: rename }, id }));
      labelsQuery.refetch(); // TODO: needs better update logic
      setIsEditing(false);
    }
  }, [labelsQuery, rename, dispatch, id, dialogContext, name]);

  const openSongs = useCallback(() => {
    // TODO
  }, []);

  const style: { bgcolor?: string } = {};
  if (isHovered) {
    style.bgcolor = theme.palette.action.hover;
  }

  return (
    <ListItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} sx={style}>
      {isHovered ? (
        <IconButton aria-label="delete" onClick={isHovered ? onRemoveLabel : undefined}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      ) : (
        <LabelIcon color="primary" sx={{ marginRight: 2 }} />
      )}

      {isEditing ? (
        <Input
          value={rename}
          onChange={onRenameChange}
          onSubmit={onEditLabel}
          autoFocus
          sx={{ width: "40ch" }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="commit rename" onClick={onCommitEdit}>
                <CheckIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      ) : (
        <ListItemText primary={name} />
      )}

      <ListItemSecondaryAction>
        <IconButton aria-label="open songs" onClick={openSongs}>
          <LibraryMusicIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={onEditLabel}>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
