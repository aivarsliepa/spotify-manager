import { useHistory } from "react-router-dom";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  AccordionSummary,
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Box,
} from "@material-ui/core";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Label, Song } from "@aivarsliepa/shared";

import { createSongName } from "../../utils";
import ContentListItem from "../atoms/ContentListItem";
import ListContent from "../molecules/ListContent";
import { useGetAllLabelsQuery } from "../../store/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  draftClearLabel,
  draftExcludeLabel,
  draftIncludeLabel,
  selectAppliedExcludeLabelsFilterSet,
  selectAppliedIncludeLabelsFilterSet,
  selectDraftExcludeLabelsFilterSet,
  selectDraftIncludeLabelsFilterSet,
  selectHasDraftAnyChanges,
} from "../../store/filterSlice";
import { createSongsURL } from "../../router/helpers";
import { flexGrowColumnMixin } from "../atoms/styledComponents";

interface Props {
  songs: Song[];
}

// TODO: extract into multiple components
export default function SongList({ songs }: Props) {
  const history = useHistory();
  const allLabelsQuery = useGetAllLabelsQuery();
  const appliedExcludeLabels = useAppSelector(selectAppliedExcludeLabelsFilterSet);
  const appliedIncludeLabels = useAppSelector(selectAppliedIncludeLabelsFilterSet);
  const draftExcludeLabels = useAppSelector(selectDraftExcludeLabelsFilterSet);
  const draftIncludeLabels = useAppSelector(selectDraftIncludeLabelsFilterSet);
  const isDraftDifferent = useAppSelector(selectHasDraftAnyChanges);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [shouldShowFilters, setShouldShowFilters] = useState(false);

  const onAccordionChange = useCallback(
    (_, expanded: boolean) => {
      setShouldShowFilters(expanded);
    },
    [setShouldShowFilters]
  );

  const applyFilters = useCallback(() => {
    history.push(createSongsURL({ excludeLabels: draftExcludeLabels, includeLabels: draftIncludeLabels }));
    setShouldShowFilters(false);
  }, [history, draftExcludeLabels, draftIncludeLabels, setShouldShowFilters]);

  const labelsMap = useMemo(() => {
    const labelsMap = new Map<string, Label>();
    if (!allLabelsQuery.data) {
      return labelsMap;
    }

    for (const label of allLabelsQuery.data.labels) {
      labelsMap.set(label.id, label);
    }
    return labelsMap;
  }, [allLabelsQuery.data]);

  const labelCheckboxes = useMemo(() => {
    if (!allLabelsQuery.data) {
      return [];
    }

    return allLabelsQuery.data.labels.map(label => {
      const isLabelIncluded = draftIncludeLabels.has(label.id);
      const isLabelExcluded = draftExcludeLabels.has(label.id);

      const color = isLabelIncluded ? theme.palette.primary.main : isLabelExcluded ? theme.palette.error.main : undefined;

      return (
        <FormControlLabel
          label={<Typography sx={{ color }}>{label.name}</Typography>}
          key={label.id}
          control={
            <Checkbox
              checked={isLabelIncluded}
              indeterminate={isLabelExcluded}
              indeterminateIcon={<CancelIcon color="error" />}
              onChange={() => {
                if (isLabelExcluded) {
                  dispatch(draftClearLabel(label.id));
                } else if (isLabelIncluded) {
                  dispatch(draftExcludeLabel(label.id));
                } else {
                  dispatch(draftIncludeLabel(label.id));
                }
              }}
            />
          }
        />
      );
    });
  }, [allLabelsQuery.data, dispatch, draftExcludeLabels, draftIncludeLabels, theme.palette.error.main, theme.palette.primary.main]);

  const includeFilters = useMemo(
    () => Array.from(appliedIncludeLabels).map(labelId => <Chip key={labelId} label={labelsMap.get(labelId)?.name} color="primary" />),
    [appliedIncludeLabels, labelsMap]
  );

  const excludeFilters = useMemo(
    () => Array.from(appliedExcludeLabels).map(labelId => <Chip key={labelId} label={labelsMap.get(labelId)?.name} color="error" />),
    [appliedExcludeLabels, labelsMap]
  );

  if (!allLabelsQuery.data) {
    return <div>Loading....</div>;
  }

  return (
    <ListContent header="Songs">
      <Stack direction="row" spacing={1} sx={{ marginBottom: 1, marginX: 1 }}>
        {includeFilters} {excludeFilters}
      </Stack>

      <Accordion onChange={onAccordionChange} expanded={shouldShowFilters}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="filter-options-content">
          <Typography>Filter options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1}>
            {labelCheckboxes}
          </Stack>
          {isDraftDifferent && (
            <Button color="primary" variant="contained" onClick={applyFilters}>
              Apply
            </Button>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ ...flexGrowColumnMixin }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} itemCount={songs.length} itemSize={64} width={width}>
              {({ index, style }) => {
                const song = songs[index];
                return (
                  <ContentListItem
                    style={style}
                    text={createSongName(song)}
                    image={song.image}
                    key={song.spotifyId}
                    onClick={() => history.push(`/songs/${song.spotifyId}`)}
                  />
                );
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </ListContent>
  );
}
