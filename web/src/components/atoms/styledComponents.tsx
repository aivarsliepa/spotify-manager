import { Box, styled } from "@material-ui/core";
import { CSSProperties } from "react";

export const flexGrowColumnMixin: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
};

export const flexGrowRowMixin: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
};

export const FlexGrowBox = styled(Box)({
  ...flexGrowRowMixin,
});
