import { useHistory } from "react-router-dom";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Song } from "../../../../shared";
import { createSongName } from "../../utils";
import ContentListItem from "../atoms/ContentListItem";
import ListContent from "../molecules/ListContent";

interface Props {
  songs: Song[];
}

export default function SongList({ songs }: Props) {
  const history = useHistory();

  return (
    <ListContent header="Songs">
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList height={height} itemCount={songs.length} itemSize={64} width={width}>
            {({ index, style }) => {
              const song = songs[index];
              return (
                <ContentListItem
                  style={style}
                  text={createSongName(song)}
                  key={song.spotifyId}
                  onClick={() => history.push(`/songs/${song.spotifyId}`)}
                />
              );
            }}
          </FixedSizeList>
        )}
      </AutoSizer>
    </ListContent>
  );
}
