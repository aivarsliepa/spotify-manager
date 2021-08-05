import { useCallback } from "react";
import { Box } from "@material-ui/core";
import { Label, Song } from "@aivarsliepa/shared";

import { useAppDispatch } from "../../store/hooks";
import { createLabel, setLabelsToSong, useGetAllLabelsQuery, useGetSongByIdQuery } from "../../store/api";
import LabelList from "./LabelList";
import NewLabelForm from "../atoms/NewLabelForm";
import Spinner from "../atoms/Spinner";

interface Props {
  song: Song;
}

// temporary
function hasValue<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// TODO: THIS CONTAINS A LOT OF HACKS THAT NEEDS TO BE REWORKED
export default function SongLabels({ song: { labelIds, spotifyId } }: Props) {
  const dispatch = useAppDispatch();
  const songQuery = useGetSongByIdQuery(spotifyId);
  const labelsQuery = useGetAllLabelsQuery();
  const allLabels = labelsQuery.data;

  // TODO: THIS NEED MAJOR REWORK, MAKE IT STORE DRIVEN, DO NOT PROCESS RESPONSE HERE
  const submitNewLabel = useCallback(
    async (newLabel: string) => {
      // TODO: error handling

      const existingLabel = allLabels!.labels.find(label => label.name === newLabel);
      if (existingLabel) {
        await dispatch(setLabelsToSong({ songId: spotifyId, labels: [...labelIds, existingLabel.id] }));
      } else {
        const thunkResponse = await dispatch(createLabel({ name: newLabel }));
        const labelId = (thunkResponse.payload as Label).id;
        await dispatch(setLabelsToSong({ songId: spotifyId, labels: [...labelIds, labelId] }));
        labelsQuery.refetch(); // TODO: fix update hack
      }

      songQuery.refetch(); // TODO: fix update hack
    },
    [labelIds, spotifyId, dispatch, songQuery, labelsQuery, allLabels]
  );

  // TODO: THIS NEED MAJOR REWORK, MAKE IT STORE DRIVEN
  const onLabelDelete = useCallback(
    async (labelId: string) => {
      // TODO: error handling
      const labels = labelIds.filter(id => id !== labelId);

      await dispatch(setLabelsToSong({ songId: spotifyId, labels }));

      songQuery.refetch(); // TODO: fix update hack
    },
    [labelIds, spotifyId, dispatch, songQuery]
  );

  if (!allLabels) {
    return <Spinner />;
  }

  const labels = labelIds.map(id => allLabels!.labels.find(label => label.id === id)).filter(hasValue);

  return (
    <Box>
      <NewLabelForm onSubmit={submitNewLabel} />
      {/* TODO labels */}
      <LabelList labels={labels} onLabelClick={() => {}} onLabelDelete={onLabelDelete} />
    </Box>
  );
}
