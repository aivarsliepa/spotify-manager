import { useCallback } from "react";
import { CsvToArr } from "@aivarsliepa/shared";

import SongList from "../organisms/SongList";
import { useGetSongsQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";
import { useQuery } from "../../router/hooks";
import { useAppDispatch } from "../../store/hooks";
import { setAppliedFilters } from "../../store/filterSlice";

export default function Songs() {
  const params = useQuery();
  const playlistId = params.get("playlistId") ?? "";
  const excludeLabels = params.get("excludeLabels") ?? "";
  const includeLabels = params.get("includeLabels") ?? "";

  const { data } = useGetSongsQuery({ includeLabels, excludeLabels, playlistId });

  const dispatch = useAppDispatch();
  dispatch(setAppliedFilters({ excludeLabels: CsvToArr(excludeLabels), includeLabels: CsvToArr(includeLabels) }));

  const render = useCallback(() => <SongList songs={data!.songs} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
