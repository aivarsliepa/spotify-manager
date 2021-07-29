import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Box } from "@material-ui/core";

export default function Spinner() {
  return (
    <Box justifyContent="center" display="flex">
      <CircularProgress />
    </Box>
  );
}
