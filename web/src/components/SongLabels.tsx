import React, { useCallback, useState } from "react";

import LabelBadge from "./LabelBadge";
import { Song } from "../../../shared";
import { useAppDispatch } from "../store/hooks";
import { changeLabels, useGetSongByIdQuery } from "../store/api";

interface Props {
  song: Song;
}

// TODO: this whole logic is not very dynamic to inputs, probably needs to be reworked, but it will do for now as a POC
const SongLabels: React.FC<Props> = ({ song }) => {
  const [newLabel, setNewLabel] = useState("");
  const dispatch = useAppDispatch();
  const songQuery = useGetSongByIdQuery(song.spotifyId);

  const submitNewLabel = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { labels, spotifyId } = song;
      setNewLabel("");
      // TODO: error handling
      await dispatch(changeLabels({ songId: spotifyId, labels: [...new Set([...labels, newLabel])] }));
      songQuery.refetch(); // TODO: this is nasty hack for optimistic update, need better solution!
    },
    [song, setNewLabel, newLabel, dispatch, songQuery]
  );

  const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNewLabel(event.target.value), [setNewLabel]);

  const labels = song.labels.map(label => <LabelBadge labelName={label} key={label} />);
  return (
    <div>
      {labels}
      <form onSubmit={submitNewLabel}>
        <input value={newLabel} onChange={onChangeHandler} />
      </form>
    </div>
  );
};

export default SongLabels;
