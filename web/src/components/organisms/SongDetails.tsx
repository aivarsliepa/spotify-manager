import { useCallback } from "react";
import { Typography, Box, Card, CardContent, CardMedia, IconButton } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";

import SongLabels from "../molecules/SongLabels";
import { Song } from "../../../../shared";
import { useAppDispatch } from "../../store/hooks";
import { playSong } from "../../store/api";

type Props = {
  song: Song;
};

export default function SongDetails({ song }: Props) {
  const dispatch = useAppDispatch();

  const onClickHandler = useCallback(() => {
    dispatch(playSong(song.spotifyId));
    // TODO: error handling
  }, [dispatch, song.spotifyId]);

  return (
    <Card sx={{ display: "flex" }}>
      {/* TODO get real image and responsive image */}
      {/* TODO styling */}
      <CardMedia
        sx={{ width: 240, height: 240 }}
        image="https://i.scdn.co/image/ab67616d00001e029c284a6855f4945dc5a3cd73"
        title="Album image"
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="h4">{song.name}</Typography>
          <Typography variant="h5" color="text.secondary">
            {song.artists}
          </Typography>
          <SongLabels song={song} />
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <IconButton aria-label="play" onClick={onClickHandler}>
            <PlayArrow sx={{ height: 38, width: 38 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}