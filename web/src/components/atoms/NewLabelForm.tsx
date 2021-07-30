import React, { useCallback, useState } from "react";
import { TextField } from "@material-ui/core";

interface Props {
  onSubmit: (newLabel: string) => void;
}

// TODO: can be generalized to simple input, if there are more neede
export default function NewLabelForm({ onSubmit }: Props) {
  const [newLabel, setNewLabel] = useState("");
  const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNewLabel(event.target.value), [setNewLabel]);

  const submitNewLabel = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(newLabel);
      setNewLabel("");
    },
    [onSubmit, newLabel, setNewLabel]
  );

  return (
    <form onSubmit={submitNewLabel}>
      <TextField sx={{ marginY: 2 }} label="Add label" variant="outlined" value={newLabel} onChange={onChangeHandler} size="small" />
    </form>
  );
}
