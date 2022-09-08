import { Card, List } from "@material-ui/core";

import { WithChildren } from "../../types";
import { flexGrowColumnMixin } from "../atoms/styledComponents";

export default function ListContent({ children }: WithChildren) {
  return (
    <Card raised sx={{ ...flexGrowColumnMixin }}>
      <List sx={{ ...flexGrowColumnMixin }}>{children}</List>
    </Card>
  );
}
