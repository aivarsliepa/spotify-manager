import React from "react";

import { Playlist } from "../../../../shared";
import PlaylistListItem from "./PlaylistListItem";
import ListContent from "../molecules/ListContent";

interface Props {
  playlists: Playlist[];
}

const PlaylistList: React.FC<Props> = props => {
  const list = props.playlists.map(playlist => <PlaylistListItem playlist={playlist} key={playlist.spotifyId} />);

  return <ListContent header="Playlists">{list}</ListContent>;
};
export default PlaylistList;
