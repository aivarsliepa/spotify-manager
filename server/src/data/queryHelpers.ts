import { SongDocument } from "./Song";

/**
 * Query songs based on labels it has. Filter rules only if Set is not empty.
 * @param inputSongs input song documents
 * @param includeLabels hexString list of label IDs that song should have
 * @param excludeLabels hexString list of label IDs that song not have
 * @param limit max number of songs returned
 * @param offset ofset where songs are being counted from
 */
export function selectSongsByLabels(
  inputSongs: SongDocument[],
  includeLabels: Set<string>,
  excludeLabels: Set<string>,
  limit = 0,
  offset = 0
): SongDocument[] {
  let matchedSongs = inputSongs;

  const shouldUseIncludeList = includeLabels.size > 0;
  const shouldUseExcludeList = excludeLabels.size > 0;

  if (shouldUseIncludeList || shouldUseExcludeList) {
    matchedSongs = matchedSongs.filter(song => {
      let shouldInclude = !shouldUseIncludeList;

      for (const label of song.labels) {
        const labelHexString = label.toHexString();

        if (shouldUseExcludeList && excludeLabels.has(labelHexString)) {
          return false;
        }

        if (shouldUseIncludeList && includeLabels.has(labelHexString)) {
          shouldInclude = true;
        }
      }

      return shouldInclude;
    });
  }

  if (limit > 1) {
    return matchedSongs.slice(offset, offset + limit);
  }

  return matchedSongs.slice(offset);
}

/**
 * Filter songs that are in playlist
 */
export function selectSongsByPlaylistId(inputSongs: SongDocument[], playlistSpotifyId: string): SongDocument[] {
  return inputSongs.filter(song => {
    for (const id of song.playlists) {
      if (id === playlistSpotifyId) {
        return true;
      }
    }
    return false;
  });
}
