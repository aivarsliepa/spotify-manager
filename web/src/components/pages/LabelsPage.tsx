import { useCallback } from "react";

import { useGetAllLabelsQuery } from "../../store/api";
import LabelContentList from "../organisms/LabelContentList";
import SpinnerTemplate from "../templates/SpinnerTemplate";

export default function LabelsPage() {
  const { data } = useGetAllLabelsQuery();

  const render = useCallback(() => <LabelContentList labels={data!.labels} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
