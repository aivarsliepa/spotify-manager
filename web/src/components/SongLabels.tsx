import React, { useCallback, useState } from "react";

import LabelBadge from "./LabelBadge";
import * as api from "../api";
import { Song } from "../store/songsSlice";

interface Props {
  song: Song;
}

const SongLabels: React.FC<Props> = ({ song }) => {
  const [newLabel, setNewLabel] = useState("");

  const submitNewLabel = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { labels, spotifyId } = song;
      const request = api.changeLabels(spotifyId, [...new Set([...labels, newLabel])]);
      setNewLabel("");
      await request;
      // TODO: error handling
      // TODO: optimistic update
    },
    [song, setNewLabel, newLabel]
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
