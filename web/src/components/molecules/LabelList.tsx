import { Stack } from "@material-ui/core";
import { Label } from "@aivarsliepa/shared";
import { useMemo } from "react";

import LabelBadge from "../atoms/LabelBadge";

interface Props {
  labels: Label[];
  onLabelClick: () => void;
  onLabelDelete: (labelId: string) => void; // TODO: use context to pass props?
}

export default function LabelList({ labels, onLabelClick, onLabelDelete }: Props) {
  const labelList = useMemo(
    () =>
      labels.map(label => <LabelBadge label={label.name} key={label.id} onClick={onLabelClick} onDelete={() => onLabelDelete(label.id)} />),
    [labels, onLabelClick, onLabelDelete]
  );

  return (
    <Stack direction="row" spacing={1}>
      {labelList}
    </Stack>
  );
}
