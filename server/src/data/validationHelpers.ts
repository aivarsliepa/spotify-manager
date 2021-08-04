import { Types } from "mongoose";

import { UserDocument } from "./User";

type LabelValidationReturn =
  | { isValid: false }
  | {
      isValid: true;
      labelHexStrings: Set<string>;
    };

/**
 * Validate if comma separated list of Label IDs are actually all valid label IDs.
 * @param user User model
 * @param labelIdsString comma separated list of Label IDs
 * @returns isValid boolean and label IDs in a Set as as string, if it's valid
 */
export function transformAndValideStringLabelIds(user: UserDocument, labelIdsString: string): LabelValidationReturn {
  if (!labelIdsString) {
    return {
      isValid: true,
      labelHexStrings: new Set(),
    };
  }

  const potentialIds = labelIdsString.split(",").map(id => id.trim());

  // no duplicates
  const potentialIdsSet = new Set(potentialIds);
  if (potentialIdsSet.size !== potentialIds.length) {
    return { isValid: false };
  }

  // all Ids has to be existing Ids
  const allExistingUserLabelIds = new Set(user.labels.map(label => Types.ObjectId(label.id).toHexString()));
  const hasNonExistingId = potentialIds.some(id => !allExistingUserLabelIds.has(id));
  if (hasNonExistingId) {
    return { isValid: false };
  }

  return {
    isValid: true,
    labelHexStrings: potentialIdsSet,
  };
}

export function isPlaylistSpotifyIdValid(user: UserDocument, playlistId: string): boolean {
  for (const playlist of user.playlists) {
    if (playlist.spotifyId === playlistId) {
      return true;
    }
  }

  false;
}
