import { Card, CardContent, List, TextField, Typography } from "@material-ui/core";
import { useCallback, useState, useMemo } from "react";

import { Label } from "../../../../shared";
import LabelContentListItem from "../molecules/LabelContentListItem";

interface Props {
  labels: Label[];
}

export default function LabelContentList({ labels }: Props) {
  const [searchText, setSearchText] = useState("");

  const onSearchChage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value), [setSearchText]);
  const listItems = useMemo(
    () => labels.filter(label => label.includes(searchText)).map(label => <LabelContentListItem text={label} key={label} />),
    [labels, searchText]
  );

  return (
    <Card raised>
      <CardContent>
        <Typography variant="h5">Labels</Typography>
        <TextField sx={{ padding: 2, width: "100%" }} placeholder="Search.." type="search" value={searchText} onChange={onSearchChage} />
      </CardContent>

      <List>{listItems}</List>
    </Card>
  );
}
