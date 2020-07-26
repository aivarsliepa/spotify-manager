import React from "react";

import { Song } from "../../store/songs/types";
import SongListItem from "../song-list-item/SongListItem";

interface Props {
  songs: Song[];
}

const SongList: React.FC<Props> = props => {
  const songList = props.songs.map(song => <SongListItem song={song} key={song.spotifyId} />);

  return <ul>{songList}</ul>;
};

export default SongList;
