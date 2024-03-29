import { Card, List, TextField } from "@material-ui/core";
import { useCallback, useState, useMemo } from "react";
import { Label } from "@aivarsliepa/shared";

import LabelContentListItem from "../molecules/LabelContentListItem";

interface Props {
  labels: Label[];
}

export default function LabelContentList({ labels }: Props) {
  const [searchText, setSearchText] = useState("");

  const onSearchChage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value), [setSearchText]);
  const listItems = useMemo(
    () => labels.filter(label => label.name.includes(searchText)).map(label => <LabelContentListItem label={label} key={label.id} />),
    [labels, searchText]
  );

  return (
    <Card raised>
      <TextField sx={{ padding: 2, width: "100%" }} placeholder="Search.." type="search" value={searchText} onChange={onSearchChage} />

      <List>{listItems}</List>
    </Card>
  );
}
