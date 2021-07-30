import { useCallback } from "react";
import { Box } from "@material-ui/core";

import { Song } from "../../../shared";
import { useAppDispatch } from "../store/hooks";
import { changeLabels, useGetSongByIdQuery } from "../store/api";
import LabelList from "./molecules/LabelList";
import NewLabelForm from "./atoms/NewLabelForm";

interface Props {
  song: Song;
}

export default function SongLabels({ song: { labels, spotifyId } }: Props) {
  const dispatch = useAppDispatch();
  const songQuery = useGetSongByIdQuery(spotifyId);

  const submitNewLabel = useCallback(
    async (newLabel: string) => {
      // TODO: error handling
      await dispatch(changeLabels({ songId: spotifyId, labels: [...new Set([...labels, newLabel])] }));
      songQuery.refetch(); // TODO: this is nasty hack for optimistic update, need better solution!
    },
    [labels, spotifyId, dispatch, songQuery]
  );

  return (
    <Box>
      <NewLabelForm onSubmit={submitNewLabel} />
      <LabelList labels={labels} onLabelClick={() => {}} onLabelDelete={() => {}} />
    </Box>
  );
}
