import React from "react";

import { Song } from "../../../../shared";
import ListContent from "../molecules/ListContent";
import SongListItem from "../song-list-item/SongListItem";

interface Props {
  songs: Song[];
}

const SongList: React.FC<Props> = props => {
  const songList = props.songs.map(song => <SongListItem song={song} key={song.spotifyId} />);

  return <ListContent header="Songs">{songList}</ListContent>;
};

export default SongList;
