import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Playlist } from "@aivarsliepa/shared";

import ListContent from "../molecules/ListContent";
import ContentListItem from "../atoms/ContentListItem";

interface Props {
  playlists: Playlist[];
}

export default function PlaylistList({ playlists }: Props) {
  const history = useHistory();

  const listItems = useMemo(
    () =>
      playlists.map(playlist => (
        <ContentListItem
          text={playlist.name}
          key={playlist.spotifyId}
          image={playlist.image}
          onClick={() => history.push(`/playlists/${playlist.spotifyId}`)}
          onCheckboxClick={e => {
            e.stopPropagation();
          }}
        />
      )),
    [playlists, history]
  );

  return <ListContent>{listItems}</ListContent>;
}
