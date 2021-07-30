import React from "react";
import { Card, CardContent, List, Typography } from "@material-ui/core";
import { WithChildren } from "../../types";

type Props = WithChildren<{
  header: string;
}>;

export default function ListContent({ header, children }: Props) {
  return (
    <Card raised>
      <CardContent>
        <Typography variant="h5">{header}</Typography>
      </CardContent>
      <List>{children}</List>
    </Card>
  );
}
