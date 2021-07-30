import { Box, CircularProgress } from "@material-ui/core";

export default function Spinner() {
  return (
    <Box justifyContent="center" display="flex">
      <CircularProgress />
    </Box>
  );
}
