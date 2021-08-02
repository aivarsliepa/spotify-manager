import { SongDocument } from "./Song";
import { UserDocument } from "./User";

/**
 * Query songs based on labels it has. Filter rules only if Set is not empty.
 * @param user currentUser
 * @param includeLabels hexString list of label IDs that song should have
 * @param excludeLabels hexString list of label IDs that song not have
 * @param limit max number of songs returned
 * @param offset ofset where songs are being counted from
 */
export function selectUserSongs(
  user: UserDocument,
  includeLabels: Set<string>,
  excludeLabels: Set<string>,
  limit = 0,
  offset = 0
): SongDocument[] {
  let matchedSongs: SongDocument[] = [...user.songs.values()];

  const shouldUseIncludeList = includeLabels.size > 0;
  const shouldUseExcludeList = excludeLabels.size > 0;

  if (shouldUseIncludeList || shouldUseExcludeList) {
    matchedSongs = matchedSongs.filter(song => {
      let shouldInclude = false;

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
