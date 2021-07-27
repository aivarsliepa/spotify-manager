import React from "react";

import { Song } from "../../../shared";

interface Props {
  song: Song;
}

const SongTitle: React.FC<Props> = props => {
  return <div>{`${props.song.name} - ${props.song.artists}`}</div>;
};

export default SongTitle;
