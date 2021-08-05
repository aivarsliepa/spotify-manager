interface SongsQueryParams {
  excludeLabels?: Set<string>; // csv array
  includeLabels?: Set<string>; // csv array
  playlistId?: string;
}

export const createSongsURL = ({ excludeLabels, includeLabels, playlistId }: SongsQueryParams) => {
  const query = new URLSearchParams();
  if (playlistId) {
    query.append("playlistId", playlistId);
  }
  if (excludeLabels && excludeLabels.size > 0) {
    query.append("excludeLabels", Array.from(excludeLabels).join(","));
  }
  if (includeLabels && includeLabels.size > 0) {
    query.append("includeLabels", Array.from(includeLabels).join(","));
  }

  return `/songs?${query.toString()}`;
};
