import { useCallback } from "react";

import SongList from "../organisms/SongList";
import { useGetAllSongsQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";

export default function Songs() {
  const { data } = useGetAllSongsQuery();
  const render = useCallback(() => <SongList songs={data!.songs} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
