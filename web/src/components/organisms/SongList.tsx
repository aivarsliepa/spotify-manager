import { useMemo } from "react";
import { useHistory } from "react-router-dom";

import { Song } from "../../../../shared";
import { createSongName } from "../../utils";
import ContentListItem from "../atoms/ContentListItem";
import ListContent from "../molecules/ListContent";

interface Props {
  songs: Song[];
}

export default function SongList({ songs }: Props) {
  const history = useHistory();

  const listItems = useMemo(
    () =>
      songs.map(song => (
        <ContentListItem text={createSongName(song)} key={song.spotifyId} onClick={() => history.push(`/songs/${song.spotifyId}`)} />
      )),
    [songs, history]
  );

  return <ListContent header="Songs">{listItems}</ListContent>;
}
