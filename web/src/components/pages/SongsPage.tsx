import { useCallback } from "react";

import SongList from "../organisms/SongList";
import { useGetSongsQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";
import { useAppSelector } from "../../store/hooks";
import { selectAppliedExcludeLabelsFilterSet, selectAppliedIncludeLabelsFilterSet } from "../../store/filterSlice";
import { createLabelListString } from "../../utils";

export default function Songs() {
  const includeLabelsSet = useAppSelector(selectAppliedIncludeLabelsFilterSet);
  const excludeLabelsSet = useAppSelector(selectAppliedExcludeLabelsFilterSet);
  const includeLabels = createLabelListString(includeLabelsSet);
  const excludeLabels = createLabelListString(excludeLabelsSet);

  const { data } = useGetSongsQuery({ includeLabels, excludeLabels });
  const render = useCallback(() => <SongList songs={data!.songs} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
