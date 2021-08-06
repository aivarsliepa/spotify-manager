import { Card, CardContent, List, Typography } from "@material-ui/core";

import { WithChildren } from "../../types";
import { flexGrowColumnMixin } from "../atoms/styledComponents";

type Props = WithChildren<{
  header: string;
}>;

export default function ListContent({ header, children }: Props) {
  return (
    <Card raised sx={{ ...flexGrowColumnMixin }}>
      <CardContent>
        <Typography variant="h5">{header}</Typography>
      </CardContent>
      <List sx={{ ...flexGrowColumnMixin }}>{children}</List>
    </Card>
  );
}
