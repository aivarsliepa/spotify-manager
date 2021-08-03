import { Card, CardContent, List, Typography } from "@material-ui/core";
import { useStyles } from "../../styleHooks";
import { WithChildren } from "../../types";

type Props = WithChildren<{
  header: string;
}>;

export default function ListContent({ header, children }: Props) {
  const styles = useStyles();
  return (
    <Card raised className={styles.flexGrowColumn}>
      <CardContent>
        <Typography variant="h5">{header}</Typography>
      </CardContent>
      <List className={styles.flexGrowColumn}>{children}</List>
    </Card>
  );
}
