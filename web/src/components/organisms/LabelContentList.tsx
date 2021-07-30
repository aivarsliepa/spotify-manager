import { useMemo } from "react";

import { Label } from "../../../../shared";
import ListContent from "../molecules/ListContent";
import LabelContentListItem from "../molecules/LabelContentListItem";

interface Props {
  labels: Label[];
}

export default function LabelContentList({ labels }: Props) {
  const listItems = useMemo(() => labels.map(label => <LabelContentListItem text={label} key={label} onClick={() => {}} />), [labels]);

  // add search bar for labels (with simple filtering)
  return <ListContent header="labels">{listItems}</ListContent>;
}
